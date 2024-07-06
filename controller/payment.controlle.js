const {Response} = require('../utils/response')
const partnerServices = require('../services/partner/partner.services')
const transactionServices = require('../services/transaction.services')
const {Transaction_Temp} = require('../models/temp_transaction.model')
const wallet = require('../services/wallet.services')
module.exports ={
    payment:async(req,res)=>{
        try {
            const {privateKey,amount,currency,message} = req.body
            const partner = await partnerServices.checkPrivateKey(privateKey)
            if(!partner){
                return Response(res,"Private key is invalid",{message:"Private key không hợp lệ"},400)
            }
            const getCurrency = await wallet.getCurrency("VND")
            await Transaction_Temp.create({type:"payment",amount:amount,partnerID:partner._id,currency:getCurrency._id,message:message}).then(data=>{
                res.redirect(process.env.HOST+"/v1/payment-gateway?token"+data._id)
            })
        } catch (error) {
            console.log(error)
            return Response(res,"Hệ thống đang lỗi, Vui lòng thử lại",'',400)
        }

    },
    paymentGateway:async(req,res)=>{
        try {
            const token = req.query.token
            const transactionData = await Transaction_Temp.findById(token).populate('partnerID').exec()
            if(!transactionData){
                return res.render('../views/page-not-found')
            }
            else{

            }
            res.render('../views/payment',{
                transactionData
            })
        } catch (error) {
            
        }
    }
}