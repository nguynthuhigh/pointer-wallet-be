const catchError = require("../../middlewares/catchError.middleware");
const TransactionServices = require('../../services/admin/transaction.services');
const { cleanData } = require("../../utils");
const {Response} = require('../../utils/response')
module.exports = {
    getTransactions: catchError( async(req,res)=>{
        const {page = 1,page_limit = 10, sort = 'desc', type, status, start, end,search} = req.query
        const filter = {
            type,status,
            createdAt: !start || !end ? undefined : {$gte: new Date(start), $lt: new Date(end)}
        }
        const data = await TransactionServices.getTransaction({
            page,page_limit,filter:cleanData(filter),
            sort:sort === 'desc' ? -1 : 1
        })
        return Response(res,'Success',data,200)
    }),
    getTransactionDetails: catchError( async(req,res)=>{
        const {id} = req.query
        return Response(res,'Success',await TransactionServices.getTransactionDetails(id),200)
    })
}