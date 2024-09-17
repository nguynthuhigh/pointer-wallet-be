const {Response} = require('../../utils/response')
const catchError = require('../../middlewares/catchError.middleware')
const managementUserServices = require('../../services/admin/user_management.services')
const transactionServices = require('../../services/transaction.services')
const { cleanData } = require('../../utils')
const {getRange} = require('../../helpers/mongoose.helpers')
module.exports = {
    getTransactionPaginate:catchError(async(req,res)=>{
        const { page = 1, page_limit = 10, sort = 'desc', start, end, type,status } = req.query;
        const filter = {
            createdAt: getRange(start,end),
            type,status
        }
        const id = req.user
        const transactions=await managementUserServices.getUserTransactions({
            userID:id,
            page,
            page_limit, 
            sort:sort ==='desc' ? -1 : 1,
            filter:cleanData(filter)})
        const data ={
            id:id,
            transactions
        }
        return Response(res,"Success",data,200)
    }),
    getTransactionDetails:catchError(async(req,res)=>{
        const transactionID = req.params.id
        
        const transactions=  await transactionServices.getTransactionDetails(transactionID,req.user)
        Response(res,"Success",{...transactions,userID:req.user},200)
    }),
}
