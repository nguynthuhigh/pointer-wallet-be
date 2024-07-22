const {Response} = require('../utils/response')
const partnerServices = require('../services/partner/partner.services')
const transactionServices = require('../services/transaction.services')
const {Transaction_Temp} = require('../models/temp_transaction.model')
const wallet = require('../services/wallet.services')
const {Transaction} = require('../models/transaction.model')
const mongoose = require('mongoose')
const bcrypt = require('../utils/bcrypt')
const cloudinary  = require('../utils/cloudinary')
const qrcode = require('../utils/qrcode')
const path = require('path') 
module.exports ={
    payment: async (req, res) => {
        try {
            const { private_key, amount, currency, message, userID } = req.body;
            const partner = await partnerServices.checkPrivateKey(private_key);
            if (!partner) {
                return Response(res, "Private key is invalid", { message: "Private key không hợp lệ" }, 400);
            }
            const getCurrency = await wallet.getCurrency(currency);
            const data = await Transaction_Temp.create({
                type: "payment",
                amount: amount,
                partnerID: partner._id,
                currency: getCurrency._id,
                message: message
            });
            qrcode.generateQrCode(data._id);
            cloudinary.uploader.upload('./utils/img/qr_code.png', async (result, err) => {
                if (err) {
                    console.log(err);
                }
                await Transaction_Temp.findByIdAndUpdate(data._id, { url: result.url }).then(result => {
                    res.redirect(process.env.HOST + "/payment-gateway?token=" + data._id);
                });
            });
        } catch (error) {
            console.log(error);
            return Response(res, "Hệ thống đang lỗi, Vui lòng thử lại", error, 400);
        }
    },
    paymentGateway:async(req,res)=>{
        try {
            const token = req.query.token
            const transactionData = await Transaction_Temp.findById(token).populate('partnerID').exec()
            return Response(res,"Successa",transactionData,200)
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
            const { currency, security_code, transactionID } = req.body;
            const getCurrency = await wallet.getCurrency(currency);
            const transactionDataTemp = await Transaction_Temp.findById(transactionID).populate('partnerID').exec();
            
            if (!transactionDataTemp) {
                await session.abortTransaction(); 
                return Response(res, "Giao dịch không tồn tại", null, 400);
            }
    
            if (!getCurrency) {
                await session.abortTransaction(); 
                return Response(res, "currency is invalid", { recommend: "VND, USD, ETH" }, 400);
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
    
            const transactionData = await Transaction.create({
                type: transactionDataTemp?.type,
                amount: transactionDataTemp?.amount,
                title: "Thanh toán hóa đơn " + transactionDataTemp.partnerID.name,
                message: "Thanh toán thành công",
                currency: getCurrency._id,
                sender: sender,
                status: "completed",
                partnerID: transactionDataTemp?.partnerID,
                userID: transactionDataTemp?.userID
            }, { session });
    
            await Transaction_Temp.findByIdAndDelete(transactionID, { session });
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