const {Response} = require('../../utils/response')
const nodemailer = require('../../utils/nodemailer')
const userServices = require('../../services/user.services')
const creditCardServices = require('../../services/credit_card.services')
const catchError = require('../../middlewares/catchError.middleware')
const {TransactionFactory, checkConditionCreateTransaction} = require('../../services/transaction.services')
const walletServices = require('../../services/wallet.services')
module.exports  = {
    sendMoney:catchError(async (req, res) => {
        const sender = req.user;
        const user_info = req.user_info
        const { receiver, amount, currency } = req.body;
        const getReceiver = await userServices.getUserById(receiver)
        const getCurrency = await checkConditionCreateTransaction({...req.body,current_security_code:req.security_code,userID:req.user})
        const transactionResult = await TransactionFactory.createTransaction('transfer',
            {...req.body,
                currency: getCurrency._id,
                type:'transfer',
                sender:sender
            })
        Response(res, "Chuyển tiền thành công", transactionResult, 200);
        await nodemailer.sendMail(getReceiver.email,`Nhận ${amount + ' ' + currency} từ ${user_info.full_name}`,`[pressPay] - ${user_info.full_name} đã chuyển tiền đến bạn `)
    }),
    depositMoney:catchError(async(req,res)=>{
        const sender = req.user
        const {cardID,amount,currency} = req.body
        const cardData =  await creditCardServices.findCardById(cardID,sender)
        const getCurrency = await walletServices.getCurrency(currency)
        const number = cardData.number.substring(cardData.number.length-4,cardData.number.length-1)
        const transactionResult = await TransactionFactory.createTransaction('deposit',
        {...req.body,
            currency: getCurrency._id,
            sender:sender,
            creditcard:cardData._id,
            title:"Nạp tiền từ thẻ ***"+number,
            message:"Nạp tiền thành công",
            amount:amount
        })
        Response(res,"Nạp tiền thành công",transactionResult,200)
    }),
    withdrawMoney:catchError(async(req,res)=>{
        const sender = req.user
        const {cardID,amount} = req.body
        const cardData =  await creditCardServices.findCardById(cardID,sender)
        const getCurrency = await checkConditionCreateTransaction({...req.body,current_security_code:req.security_code,userID:req.user})
        const number = cardData.number.substring(cardData.number.length-4,cardData.number.length-1)
        const transactionResult = await TransactionFactory.createTransaction('deposit',
        {...req.body,
            currency: getCurrency._id,
            sender:sender,
            creditcard:cardData._id,
            title:"Rút tiền về thẻ ***"+number,
            message:"Nạp tiền thành công",
            amount:-amount
        })
        Response(res,"Rút tiền thành công",transactionResult,200)
    }),
}
