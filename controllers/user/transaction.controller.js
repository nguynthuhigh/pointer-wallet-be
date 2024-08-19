const {startSession} = require('mongoose')
const {TransactionType,Transaction} = require('../../models/transaction.model')
const {Wallet,WalletType} = require('../../models/wallet.model')
const {Response}=require('../../utils/response')
const catchError = require('../../middlewares/catchError.middleware')
const transactionServices = require('../../services/admin/user_management.services')
module.exports = {
    getTransactionPaginate:catchError(async(req,res)=>{
        const {page,limit} = req.query
        const id = req.user
        const transactions=await transactionServices.getTransactionsUser(id,page,limit)
        const data ={
            id:id,
            transactions
        }
        return Response(res,"Success",data,200)
    }),
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
    }
}
