const {Response} = require('../utils/response')
const partnerServices = require('../services/partner/partner.services')
const {Transaction_Temp} = require('../models/temp_transaction.model')
const wallet = require('../services/wallet.services')
const {Transaction} = require('../models/transaction.model')
const mongoose = require('mongoose')
const bcrypt = require('../utils/bcrypt')
const moment = require('../utils/moment')
module.exports ={
    payment: async (req, res) => {
        try {
            const { private_key, amount, currency, userID,orderID,return_url } = req.body;
            const partner = await partnerServices.checkPrivateKey(private_key);
            if (!partner) {
                return Response(res, "Private key is invalid", { message: "Private key không hợp lệ" }, 400);
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
                return_url:return_url
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
            const transactionData = await Transaction.findById(token).populate('partnerID currency').exec()
            if(!moment.limitTime(transactionData?.createdAt)){
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
            const { security_code, transactionID } = req.body;
            const transactionDataTemp = await Transaction.findById(transactionID).populate('partnerID currency').exec();
            const getCurrency = transactionDataTemp.currency
            
            if (!transactionDataTemp) {
                await session.abortTransaction(); 
                return Response(res, "Giao dịch không tồn tại", null, 400);
            }
    

    
            if (!await wallet.checkBalance(sender, getCurrency._id, transactionDataTemp?.amount)) {
                await session.abortTransaction(); 
                return Response(res, "Số dư không đủ", null, 400);
            }
    
            if (!bcrypt.bcryptCompare(security_code, req.security_code)) {
                await session.abortTransaction(); 
                return Response(res, "Mã bảo mật không đúng vui lòng nhập lại", null, 400);
            }
    
            await wallet.updateBalance(sender, getCurrency._id, -transactionDataTemp?.amount, session);
            await wallet.updateBalancePartner(transactionDataTemp?.partnerID, getCurrency._id, transactionDataTemp?.amount, session);
    
            const transactionData = await Transaction.findByIdAndUpdate(transactionID,{status:'completed'},{new:true})
            await session.commitTransaction(); 
            return Response(res, "Thanh toán thành công",transactionData, 200);
        } catch (error) {
            console.log(error);
            await session.abortTransaction(); 
            return Response(res, error.message, null, 400);
        } finally {
            session.endSession();
        }
    },    
    testRedirect:(req,res)=>{
        res.redirect("https://www.google.com/")
    },
    refundMoney:async(req,res)=>{
        const session = await mongoose.startSession();
        session.startTransaction(); 
        try {
            const { receiver, amount, message, currency, private_key } = req.body;
            
            const getCurrency = await wallet.getCurrency(currency);
            if (!getCurrency) {
                await session.abortTransaction(); 
                return Response(res, "currency is invalid", { recommend: "VND, USD, ETH" }, 400);
            }
            const partner = await partnerServices.checkPrivateKey(private_key)
            if(!partner){
                return Response(res,"Private key is invalid",{message:"Private key không hợp lệ"},400)
            }
            if (!await wallet.checkBalancePartner(partner._id, getCurrency._id, amount)) {
                await session.abortTransaction(); 
                return Response(res, "Số dư không đủ", null, 400);
            }
            const transactionResult = await Transaction.create({
                type: 'refund',
                amount: amount,
                message: message,
                title: null,
                currency: getCurrency._id,
                partnerID: partner._id,
                receiver: receiver,
                status: "completed"
            });
  
            await wallet.updateBalancePartner(partner._id, getCurrency._id, -amount, session);
            await wallet.updateBalance(receiver, getCurrency._id, amount, session);
            
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

}
