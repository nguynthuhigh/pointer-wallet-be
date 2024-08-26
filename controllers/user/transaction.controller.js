const {Response} = require('../../utils/response')
const catchError = require('../../middlewares/catchError.middleware')
const managementUserServices = require('../../services/admin/user_management.services')
const transactionServices = require('../../services/transaction.services')
module.exports = {
    getTransactionPaginate:catchError(async(req,res)=>{
        const {page,limit} = req.query
        const id = req.user
        console.log(id)
        const transactions=await managementUserServices.getTransactionsUser(id,page,limit)
        const data ={
            id:id,
            transactions
        }
        return Response(res,"Success",data,200)
    }),
    getTransactionDetails:catchError(async(req,res)=>{
        const transactionID = req.params.id
        const transactions=  await transactionServices.getTransactionDetails(transactionID,req.user)
        Response(res,"Success",transactions,200)
    }),
}
