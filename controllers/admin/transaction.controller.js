const catchError = require("../../middlewares/catchError.middleware");
const TransactionServices = require('../../services/admin/transaction.services')
const {Response} = require('../../utils/response')
module.exports = {
    getTransactions: catchError( async(req,res)=>{
        const {page,limit} = req.query
        const data = await TransactionServices.getTransaction(page,limit)
        return Response(res,'Success',data,200)
    })
}