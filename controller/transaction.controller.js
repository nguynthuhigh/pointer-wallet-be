const {startSession} = require('mongoose')
const {TransactionType,Transaction} = require('../models/transaction.model')
const {Wallet,WalletType} = require('../models/wallet.model')
const {Response}=require('../utils/response')
module.exports = {
    createTransactionType:async(req,res)=>{

    },
    //user
    getTransactions:async(req,res)=>{
        try {
            const id = req.user
            const transactions=await Transaction.find({$or:[{receiver:id},{sender:id}]}).populate('sender receiver currency')
            return Response(res,"Success",transactions,200)
        } catch (error) {
            return Response(res,error,null,400)
        }
    },
    getTransactionDetails:async(req,res)=>{
        try {
            const id = req.user
            const idTransaction = req.params.id
            const transactions=await Transaction.findById(idTransaction)
                .populate('creditcard sender receiver currency')
                .exec()
            Response(res,"Success",transactions,200)
        } catch (error) {
            Response(res,error,null,400)
        }
    },
    getTransactions_receive:async(req,res)=>{
        try {
            const id = req.user
            const transactions=await Transaction.find({receiver:id}).populate('transactionTypeID').exec()
            res.status(200).json({message:"Success",data:transactions})
        } catch (error) {
            res.status(400).json({error:error})
            
        }
    }
}
