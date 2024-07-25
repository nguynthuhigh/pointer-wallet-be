const {Response} = require('../utils/response')
const partnerServices = require('../services/partner/partner.services')
const {Transaction_Temp} = require('../models/temp_transaction.model')
const wallet = require('../services/wallet.services')
const {Transaction} = require('../models/transaction.model')
const mongoose = require('mongoose')
const bcrypt = require('../utils/bcrypt')
const moment = require('../utils/moment')
const voucherServices = require('../services/voucher.servcies')
const transactionServices = require('../services/transaction.services')
const nodemailer = require('../utils/nodemailer')
const ccType = require('../utils/cctype')
module.exports ={
    payment: async (req, res) => {
        try {
            const { private_key, amount, currency, userID,orderID,return_url,message } = req.body;
            const partner = await partnerServices.checkPrivateKey(private_key);
            if (!partner) {
                return Response(res, "Private key is invalid", { message: "Private key không hợp lệ" }, 401);
            }
            const getCurrency = await wallet.getCurrency(currency);
            if(!getCurrency){
                return Response(res, "Accept currencies VND, USD, ETH", { message: "" }, 400);
            }
            const data = await Transaction.create({
                type: "payment",
                amount: amount,
                partnerID: partner._id,
                currency: getCurrency._id,
                orderID: orderID,
                userID:userID,
                return_url:return_url,
                message:message
            });
            res.status(200).json({message:"Redirect to url",url:process.env.PAYMENT_HOST + "/payment-gateway?token=" + data._id})
        } catch (error) {
            console.log(error);
            return Response(res, "Hệ thống đang lỗi, Vui lòng thử lại", error, 400);
        }
    },
    paymentGateway:async(req,res)=>{
        try {
            const token = req.query.token
            const transactionData = await transactionServices.getTransaction(token)
            if(!moment.limitTime(transactionData?.createdAt) || (transactionData.status != 'pending')){
                return Response(res,"Giao dịch không tồn tại","",200)
            }
            
            return Response(res,"Success",transactionData,200)
        } catch (error) {
            console.log(error)
            return Response(res,"Giao dịch không tồn tại",null,400)
            
        }
    },
    confirmPayment: async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const sender = req.user;
            const { security_code, transactionID, voucher_code } = req.body;
            const transactionDataTemp = await Transaction.findById(transactionID).populate('partnerID currency').exec();
            if (!transactionDataTemp || (transactionDataTemp.status !== 'pending')) {
                await session.abortTransaction();
                return Response(res, "Giao dịch không tồn tại", null, 400);
            }
            let amount = transactionDataTemp.amount;
            const getVoucher = await voucherServices.getVoucherByCode(voucher_code);
            if(getVoucher !== false){
                const result_apply = voucherServices.applyVoucher(getVoucher.type, transactionDataTemp.amount, getVoucher.discountValue, getVoucher.quantity);
                if (result_apply === false) {
                    await session.abortTransaction();
                    return Response(res, "Số lượng voucher đã hết vui lòng thử lại!", null, 400);
                }
                amount = result_apply
            }
            if (!bcrypt.bcryptCompare(security_code, req.security_code)) {
                await session.abortTransaction();
                return Response(res, "Mã bảo mật không đúng vui lòng nhập lại", null, 400);
            }
            const getCurrency = transactionDataTemp.currency;
            if (!wallet.checkBalance(sender, getCurrency._id, amount)) {
                await session.abortTransaction();
                return Response(res, "Số dư không đủ", null, 400);
            }
            const updateBalanceResult = await wallet.updateBalance(sender, getCurrency._id, -amount, session);
            if (!updateBalanceResult) {
                await session.abortTransaction();
                return Response(res, "Lỗi giao dịch vui lòng thử lại", null, 500);
            }
            const updateBalancePartnerResult = await wallet.updateBalancePartner(transactionDataTemp.partnerID, getCurrency._id, amount, session);
            if (!updateBalancePartnerResult) {
                await session.abortTransaction();
                return Response(res, "Lỗi giao dịch vui lòng thử lại (partner)", null, 500);
            }
            await voucherServices.updateQuantityVoucher(getVoucher._id,session)
            const transactionData = await Transaction.findByIdAndUpdate(transactionID, {
                status: 'completed',
                amount: amount,
                voucherID: getVoucher?._id,
                sender:req.user
            }, { new: true });
    
            await session.commitTransaction();
            return Response(res, "Thanh toán thành công", transactionData, 200);
        } catch (error) {
            console.log(error);
            await session.abortTransaction();
            return Response(res, error.message, null, 400);
        } finally {
            session.endSession();
        }
    },
    
    testRedirect:async(req,res)=>{
        await Transaction_Temp.create({
            type: "payment",
            amount: "123",
        });
        Response(res, "", "null", 200);
    },
    refundMoney:async(req,res)=>{
        const session = await mongoose.startSession();
        session.startTransaction(); 
        try {
            const {private_key,orderID} = req.body;
            
            const partner = await partnerServices.checkPrivateKey(private_key)
            if(!partner){
                return Response(res,"Private key is invalid",{message:"Private key không hợp lệ"},400)
            }
            const transactionData = await transactionServices.getTransactionRefund(partner._id,orderID)
            if(!transactionData){
                return Response(res, "Không tìm thấy giao dịch", null, 400);
            }
            if (!await wallet.checkBalancePartner(partner._id, transactionData.currency, transactionData.amount)) {
                await session.abortTransaction(); 
                return Response(res, "Số dư không đủ", null, 400);
            }
            const transactionResult = await Transaction.create({
                type: 'refund',
                amount: transactionData.amount,
                message: "Hoàn tiền",
                title: "Hoàn tiền từ " + partner.name,
                currency: transactionData._id,
                partnerID: partner._id,
                receiver: transactionData.sender,
                status: "completed"
            });
  
            await wallet.updateBalancePartner(partner._id, transactionData.currency, -transactionData.amount, session);
            await wallet.updateBalance(transactionData.sender, transactionData.currency, transactionData.amount, session);
            
            await session.commitTransaction(); 
            return Response(res, "Hoàn tiền thành công", transactionResult, 200);
        } catch (error) {
            console.log(error);
            await session.abortTransaction(); 
            return Response(res, error.message, null, 400);
        } finally {
            session.endSession();
        }
    },
    applyVoucher: async (req, res) => {
        const { code, transactionID } = req.body;
    
        try {
            const voucher = await voucherServices.getVoucherByCode(code);
            if (!voucher) {
                return Response(res, "Voucher không tồn tại", null, 404);
            }
            const transactionData = await transactionServices.getTransaction(transactionID);
            if (!transactionData) {
                return Response(res, "Transaction không tồn tại", null, 404);
            }
            if (transactionData.partnerID._id.toString() !== voucher.partnerID.toString()) {
                return Response(res, "Voucher không hợp lệ với giao dịch này", null, 400);
            }
            if (voucher.min_condition > transactionData.amount || voucher.max_condition < transactionData.amount) {
                return Response(res, `Không thể áp dụng voucher. Đơn hàng tối thiểu ${voucher.min_condition} và tối đa ${voucher.max_condition}`, null, 400);
            }
            const resultApply = voucherServices.applyVoucher(voucher.type, transactionData.amount, voucher.discountValue, voucher.quantity);
            if(!resultApply){
                return Response(res, "Không thể áp dụng voucher do số lượng đã hết", null, 400);
            }
            return Response(res, "Áp dụng voucher thành công", resultApply, 200);
        } catch (error) {
            console.error(error);
            return Response(res, "Áp dụng voucher thất bại vui lòng thử lại", null, 500);
        }
    },
    getSession:async(req,res)=>{
        try {
            const {session_id} = req.query
            const data = await Transaction.findById(session_id)
            Response(res,"Session infomation",data,200)
        } catch (error) {
            console.log(error)
            return Response(res,"Error",null,500)
        }
    },
    payWithCard: async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const {transactionID, voucher_code,email,card} = req.body;
            const type =ccType.getCardType(card) 
            if(type=== false || card.length < 14 || type === undefined){
                return Response(res, "Thẻ không hợp lệ vui lòng thử lại", null, 400);
            }
            const transactionDataTemp = await Transaction.findById(transactionID).populate('partnerID currency').exec();
            if (!transactionDataTemp || (transactionDataTemp.status !== 'pending')) {
                await session.abortTransaction();
                return Response(res, "Giao dịch không tồn tại", null, 400);
            }
            let amount = transactionDataTemp.amount;
            const getVoucher = await voucherServices.getVoucherByCode(voucher_code);
            if(getVoucher !== false){
                const result_apply = voucherServices.applyVoucher(getVoucher.type, transactionDataTemp.amount, getVoucher.discountValue, getVoucher.quantity);
                if (result_apply === false) {
                    await session.abortTransaction();
                    return Response(res, "Số lượng voucher đã hết vui lòng thử lại!", null, 400);
                }
                amount = result_apply
            }
            const getCurrency = transactionDataTemp.currency;
            const updateBalancePartnerResult = await wallet.updateBalancePartner(transactionDataTemp.partnerID, getCurrency._id, amount, session);
            if (!updateBalancePartnerResult) {
                await session.abortTransaction();
                return Response(res, "Lỗi giao dịch vui lòng thử lại (partner)", null, 500);
            }
            await voucherServices.updateQuantityVoucher(getVoucher._id,session)
            const transactionData = await Transaction.findByIdAndUpdate(transactionID, {
                type:'pay-with-card',
                status: 'completed',
                amount: amount,
                voucherID: getVoucher?._id,
                sender:req.user
            }, { new: true });
            nodemailer.sendMail(email,`Bạn đã thanh toán thành công hóa đơn ${transactionData?.orderID} \n Sản phẩm: ${transactionData?.message} \n Phương thức: ${type}`,`[${new Date(Date.now())}] pressPay - Thanh toán hóa đơn thành công`)
            await session.commitTransaction();
            return Response(res, "Thanh toán thành công", transactionData, 200);
        } catch (error) {
            console.log(error);
            await session.abortTransaction();
            return Response(res, error.message, null, 400);
        } finally {
            session.endSession();
        }
    },
    webHook:async()=>{
        
    }

}
