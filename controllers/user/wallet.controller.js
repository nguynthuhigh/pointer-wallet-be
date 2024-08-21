const {Transaction} = require('../../models/transaction.model')
const mongoose = require('mongoose')
const wallet = require('../../services/wallet.services')
const transaction = require('../../services/transaction.services')
const {Response} = require('../../utils/response')
const bcrypt = require('../../utils/bcrypt')
const stripe = require('../../services/stripe.services')
const nodemailer = require('../../utils/nodemailer')
const userServices = require('../../services/user.services')
const AppError = require('../../helpers/handleError')
const creditCardServices = require('../../services/credit_card.services')
const catchError = require('../../middlewares/catchError.middleware')
const {TransactionFactory} = require('../../services/transaction.services')
module.exports  = {
    sendMoney:catchError(async (req, res) => {
        const sender = req.user;
        const user_info = req.user_info
        const { receiver, amount, currency, security_code } = req.body;
        const getCurrency = await wallet.getCurrency(currency);
        const getReceiver = await userServices.getUserById(receiver)
        await wallet.hasSufficientBalance(sender, getCurrency._id, amount)
        if (!bcrypt.bcryptCompare(security_code, req.security_code)) {
            throw new AppError("Mã bảo mật không đúng",402)
        }
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
        const session = await mongoose.startSession()
        session.startTransaction()
        const sender = req.user
        const {currency,amount,cardID,security_code} = req.body
        const cardData = creditCardServices.findCardById(cardID)
        
        if (!bcrypt.bcryptCompare(security_code, req.security_code)) {
            throw new AppError("Mã bảo mật không đúng",402)
        }
        // const paymentIntent =await stripe.depositStripe(amount*100,currency)
        // if(paymentIntent.status !== 'succeeded'){
        //     return Response(res,"Nạp tiền thất bại",null,400)
        // }
        const getCurrency = await wallet.getCurrency(currency)
        await wallet.updateBalance(sender,getCurrency._id,amount,session)
        const number = cardData.number.substring(cardData.number.length-4,cardData.number.length-1)
        const transactionData = await Transaction.create({
            type:'deposit',
            amount:amount,
            title:"Nạp tiền từ thẻ ***"+number,
            message:"Nạp tiền thành công",
            currency:getCurrency._id,
            sender:sender,
            creditcard:cardData._id,
            status:"completed"
        },{session})
        Response(res,"Nạp tiền thành công",transactionData,200)
        await session.commitTransaction(); 
        await session.endSession(); 
    }),
}
