const {Response} = require('../../utils/response')
const wallet = require('../../services/wallet.services')
const {Transaction} = require('../../models/transaction.model')
const mongoose = require('mongoose')
const bcrypt = require('../../utils/bcrypt')
const moment = require('../../utils/moment')
const voucherServices = require('../../services/voucher.services')
const transactionServices = require('../../services/transaction.services')
const webhookAPI = require('../../utils/webhook.call.api')
const catchError = require('../../middlewares/catchError.middleware')
const AppError = require('../../helpers/handleError')
module.exports ={
    requestPayment: catchError(async (req, res) => {
        const {amount, currency, userID,orderID,return_url,message } = req.body;
        const partner = req.partner
        const getCurrency = await wallet.getCurrency(currency);
        const data = await Transaction.create({
            type: "payment",
            amount: amount,
            partnerID: partner._id,
            currency: getCurrency._id,
            title:"Thanh toán hóa đơn " + partner.name, 
            orderID: orderID,
            userID:userID,
            return_url:return_url,
            message:message
        });
        res.status(200).json({message:"Redirect to url",url:process.env.PAYMENT_HOST + "/payment-gateway?token=" + data._id})
    }),
    //[GET] /payment-gateway?token=id
    getTransaction:catchError(async(req,res)=>{
        const token = req.query.token
        const transactionData = await transactionServices.getTransactionForPayment(token)
        const timeLimit = moment.limitTime(transactionData.createdAt)
        if(timeLimit < 0 || (transactionData?.status != 'pending') || !transactionData){
            throw new AppError('Không tìm thấy giao dịch',402)
        }
        if(transactionData.status === 'completed'){
            return Response(res,"Redirect to url",(transactionData.return_url).replace('{orderID}',transactionData.orderID),201)
        }
        return Response(res,"Success",transactionData,200)
    
    }),
    //[POST] /api/v1/confirm-payment
    confirmPayment:catchError(async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        const sender = req.user;
        const { security_code, transactionID, voucher_code } = req.body;
        const transactionDataTemp = await transactionServices.getTransactionForPayment(transactionID)
        if (!transactionDataTemp || transactionDataTemp.status === 'completed') {
            throw new AppError('Không tìm thấy giao dịch',402)
        }
        if (!bcrypt.bcryptCompare(security_code, req.security_code)) {
            throw new AppError('Mã bảo mật không đúng',400)
        }
        let amount = transactionDataTemp.amount;
        const getCurrency = transactionDataTemp.currency;
        const resultApply = await voucherServices.applyVoucherPayment(transactionDataTemp,session,voucher_code,getCurrency._id)
        amount = resultApply.amount 
        const voucherID = resultApply?.voucherID
        await wallet.hasSufficientBalance(sender, getCurrency._id, amount)
        await wallet.updateBalance(sender, getCurrency._id, -amount, session);
        await wallet.updateBalancePartner(transactionDataTemp.partnerID, getCurrency._id, amount, session);
        const transactionData = await transactionServices.updateCompletedPayment(amount,voucherID,req.user,transactionID,session)
        await webhookAPI.postWebhook((transactionDataTemp?.partnerID?.webhook),
                                    ({status:"completed",orderID:transactionDataTemp.orderID}))
        await session.commitTransaction();
        session.endSession();
        return Response(res, "Thanh toán thành công", transactionData, 200);
    }),
    refundMoney:catchError(async(req,res)=>{
        const session = await mongoose.startSession();
        session.startTransaction(); 
        const {orderID} = req.body;
        const transactionData = await transactionServices.getTransactionRefund(partner._id,orderID)
        if(!transactionData || transactionData.status != 'completed'){
            return Response(res, "", null, 400);
        }
        await wallet.checkBalancePartner(partner._id, transactionData.currency, transactionData.amount)
        await transactionServices.updateTransactionRefund(transactionData,session)
        const transactionResult = await Transaction.create({
            type: 'refund',
            amount: transactionData.amount,
            message: "Hoàn tiền",
            title: "Hoàn tiền từ " + partner.name,
            currency: transactionData._id,
            partnerID: partner._id,
            receiver: transactionData.sender,
            status: "refunded",
            orderID:transactionData.orderID
        },{session});
        await wallet.updateBalancePartner(partner._id, transactionData.currency, -transactionData.amount, session);
        await wallet.updateBalance(transactionData.sender, transactionData.currency, transactionData.amount, session);
        await session.commitTransaction(); 
        session.endSession();
        return Response(res, "Hoàn tiền thành công", transactionResult, 200);
    }),
    applyVoucher: catchError(async (req, res) => {
        const { code, transactionID } = req.body;
        const voucher = await voucherServices.getVoucherByCode(code);
        const transactionData = await transactionServices.getTransactionForPayment(transactionID);
        await voucherServices.checkOwnVoucher(transactionData.partnerID._id,voucher.partnerID)
        console.log(voucher)
        const amount = voucherServices.applyVoucher(voucher.type, transactionData.amount, voucher.discountValue, voucher.quantity,transactionData.currency._id,voucher.currency);
        return Response(res, "Áp dụng voucher thành công", amount, 200);
    }),
}
