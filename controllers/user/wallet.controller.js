const {Transaction} = require('../../models/transaction.model')
const {Currency} = require('../../models/wallet.model')
const mongoose = require('mongoose')
const wallet = require('../../services/wallet.services')
const transaction = require('../../services/transaction.services')
const {Response} = require('../../utils/response')
const bcrypt = require('../../utils/bcrypt')
const stripe = require('../../services/stripe.services')
const {CreditCard} = require('../../models/creditcard.model')
const convert = require('../../utils/convert_currency')
module.exports  = {
    //admin
    getCurrency:async(req,res)=>{
        try {
            Currency.find(req.body).then(data=>{
                return Response(res,"Success",data,200)
                
            }).catch(err=>{
                return Response(res,err,null,400)
            })
        } catch (error) {
            return Response(res,error,null,400)
        }
    },
    addCurrency:async(req,res)=>{
        try {
            Currency.create(req.body).then(data=>{
                return Response(res,"Success",data,200)
                
            }).catch(err=>{
                return Response(res,err,null,400)
            })
        } catch (error) {
            return Response(res,error,null,400)
        }
    },
    sendMoney: async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction(); 
        try {
            const sender = req.user;
            const { receiver, amount, message, currency, security_code } = req.body;
            
            const getCurrency = await wallet.getCurrency(currency);
            if (!getCurrency) {
                await session.abortTransaction(); 
                return Response(res, "currency is invalid", { recommend: "VND, USD, ETH" }, 400);
            }
            
            if (!await wallet.hasSufficientBalance(sender, getCurrency._id, amount)) {
                await session.abortTransaction(); 
                return Response(res, "Số dư không đủ", null, 400);
            }
            if (!bcrypt.bcryptCompare(security_code, req.security_code)) {
                await session.abortTransaction(); 
                return Response(res, "Mã bảo mật không đúng vui lòng nhập lại", null, 400);
            }
            
            const transactionResult = await Transaction.create({
                type: 'transfer',
                amount: amount,
                message: message,
                title: null,
                currency: getCurrency._id,
                sender: sender,
                receiver: receiver,
                status: "completed"
            });
            const resultUpdatedSender = await wallet.updateBalance(sender, getCurrency._id, -amount, session);
            if(resultUpdatedSender.modifiedCount === 0){
                await session.abortTransaction(); 
                return Response(res, "Chuyển tiền thất bại vui lòng thử lại", null, 400);
            } 
            const resultUpdatedReceiver = await wallet.updateBalance(receiver, getCurrency._id, amount, session);
            if(resultUpdatedReceiver.modifiedCount === 0){
                await session.abortTransaction(); 
                return Response(res, "Chuyển tiền thất bại vui lòng thử lại", null, 400);
            } 
            await session.commitTransaction(); 
            return Response(res, "Chuyển tiền thành công", transactionResult, 200);
        } catch (error) {
            console.log(error);
            await session.abortTransaction(); 
            return Response(res, error.message, null, 400);
        } finally {
            session.endSession();
        }
    },
    depositMoney:async(req,res)=>{
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const sender = req.user
            const {currency,amount,cardID,security_code} = req.body
            const card = await CreditCard.findById(cardID)
            // if( convert(amount,currency)> 20000000 || convert(amount,currency) < 10000){
            //     return Response(res,{message:"Số tiền nạp tối đa là 20.000.000 và tối thiều là 10000",card:"null"},null,400)
            // }
            if(!card){
                await session.abortTransaction()
                return Response(res,{message:"Vui lòng thêm thẻ",card:"null"},null,400)
            }
            if (!bcrypt.bcryptCompare(security_code, req.security_code)) {
                await session.abortTransaction(); 
                return Response(res, "Mã bảo mật không đúng vui lòng nhập lại", null, 400);
            }
            // const paymentIntent =await stripe.depositStripe(amount*100,currency)
            // if(paymentIntent.status !== 'succeeded'){
            //     return Response(res,"Nạp tiền thất bại",null,400)
            // }
            const getCurrency = await wallet.getCurrency(currency)
            await wallet.updateBalance(sender,getCurrency._id,amount,session)
            const number = card.number.substring(card.number.length-4,card.number.length-1)
            await Transaction.create({
                type:'deposit',
                amount:amount,
                title:"Nạp tiền từ thẻ ***"+number,
                message:"Nạp tiền thành công",
                currency:getCurrency._id,
                sender:sender,
                creditcard:card._id,
                status:"completed"
            }).then(data=>{
                Response(res,"Nạp tiền thành công",data,200)
            }).catch(error=>{
                console.log(error)
                Response(res,error,null,400)
            },{session})
            await session.commitTransaction(); 
        } catch (error) {
            console.log(error)
            Response(res,error,null,400)
        }
   
    },
    getWallet:async(req,res)=>{
        try {
            
        } catch (error) {
            
        }
    }
}
