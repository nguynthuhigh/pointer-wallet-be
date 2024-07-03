const {Transaction} = require('../models/transaction.model')
const {Currency} = require('../models/wallet.model')
const {startSession} = require('mongoose')
const wallet = require('../services/wallet.services')
const transaction = require('../services/transaction.services')
const {Response} = require('../utils/response')
const bcrypt = require('../utils/bcrypt')
const stripe = require('../services/stripe.services')
const {CreditCard} = require('../models/creditcard.model')
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
    //user
    sendMoney: async (req, res) => {
        try {
            const {receiver,amount,message,currency} = req.body
            const userID = req.user
            const getCurrency = await wallet.getCurrency(currency)
            if(!getCurrency){
                Response(res,"currency is invalid",{recommend:"VND,USD,ETH"},400)
            }
            if(wallet.checkBalance(userID,getCurrency._id,amount)){
                Transaction.create({
                    type:'transfer',
                    amount:amount,
                    message:message,
                    currency:getCurrency._id,
                    sender:userID,
                    receiver:receiver
                }).then(data=>{
                    return Response(res,"Nhập mã bảo mật",data,200)
                }).catch(error=>{
                    return Response(res,error,null,400)
                })
            }
            else{
                return Response(res,"Số dư không đủ",null,400)
            }
        } catch (error) {
            console.log(error)
            return Response(res,error,null,400)
        }
    },
    verifyTransaction:async (req,res)=>{
        const session = await startSession();
        try {
            const {security_code,transactionID}= req.body;

            const getTransaction = await transaction.getTransaction(transactionID)
            const {sender,receiver,amount,currency,status} = getTransaction
            if(status !== 'pending'){
                return Response(res,"Transaction is invalid",null,400)
            }
            await session.withTransaction(async () => {
                if(bcrypt.bcryptCompare(security_code,req.security_code) && req.user === sender){
                    await session.abortTransaction();
                    return Response(res,"Mã bảo mật không đúng vui lòng nhập lại",null,200)
                }
                await wallet.updateBalance(sender,currency,amount,session)
                await wallet.updateBalance(receiver,currency,amount,session)
                const dataTransaction = await transaction.updateStatusTransaction(getTransaction._id,"completed",session)
                return Response(res,"Chuyển tiền thành công",dataTransaction,200)

            });
        } catch (error) {
            console.log(error)
            return Response(res,error,null,400)
        }
        finally {
            session.endSession();
        }
    },
    depositMoney:async(req,res)=>{
        try {
            const userID = req.user
            const {currency,amount,cardID} = req.body
            //find user's card
            const card = await CreditCard.findById(cardID)
            if(!card){
                return Response(res,{message:"Vui lòng thêm thẻ",card:"null"},null,400)
            }
            const getCurrency = await wallet.getCurrency(currency)
            const number = card.number.substring(card.number.length-4,card.number.length-1)
            //create history transaction
            await Transaction.create({
                type:'deposit',
                amount:amount,
                title:"Nạp tiền từ thẻ ***"+number,
                message:"Nạp tiền",
                currency:getCurrency._id,
                sender:userID,
                creditcard:card._id,
            }).then(data=>{
                Response(res,"Nhập mã bảo mật để tiếp tục",data,200)
            }).catch(error=>{
                Response(res,error,null,400)
            })
        } catch (error) {
            Response(res,error,null,400)
        }
   
    },
    verifyDepositMoney:async(req,res)=>{
        const userID = req.user
        const {transactionID,security_code} = req.body
        const getTransaction = await transaction.getTransaction(transactionID)
        const {sender,amount,currency,status,creditcard} = getTransaction
        const session = await startSession()
        try{
            await session.withTransaction(async () => {
                if(status !== 'pending'){
                    return Response(res,"Transaction is invalid",null,400)
                }
                if(!bcrypt.bcryptCompare(security_code,req.security_code)){
                    return Response(res,"Mã bảo mật sai vui lòng nhập lại",null,400)
                }
                const paymentIntent =await stripe.depositStripe(amount,currency.symbol)
                if(paymentIntent.status !== 'succeeded'){
                    return Response(res,"Nạp tiền thất bại",null,400)
                }
                //update user's wallet
                await wallet.updateBalance(sender,currency._id,amount,session)
                const dataTransaction = await transaction.updateStatusTransaction(getTransaction._id,"completed",session)
                return Response(res,"Nạp tiền thành công",dataTransaction,200)
                
            })
        }catch (error){
            console.log(error)
            Response(res,error,null,400);
        }
        finally {
            session.endSession();
        }
    },
    getWallet:async(req,res)=>{
        
    }
}