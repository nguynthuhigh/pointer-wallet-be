const {Response} = require('../../utils/response')
const partner = require('../../services/partner/partner.services')
const {Partner} = require('../../models/partner.model')
const {Wallet} = require('../../models/wallet.model')
const transactionServices = require('../../services/transaction.services')

module.exports = {
    getDashboard:async(req,res)=>{
        try {
            const wallet =await Wallet.findOne({partnerID:req.partner._id}).populate('currencies.currency').exec()
            const data = {partner:req.partner,wallet}
            return Response(res,"Success",data,200)   

        } catch (error) {
           console.log(error) 
        }
    },
    updateInfo:async (req,res)=>{
        try {
            const partner = await Partner.findByIdAndUpdate(req.partner,req.body,{new:true})
            return Response(res,"Cập nhật thành công",partner,200)
        } catch (error) {
            return Response(res,error,null,400)
        }
    },
    getTransactions:async(req,res)=>{
        try {
            const partnerID = req.partner
            const {page,pagesize} = req.query
            console.log(page , pagesize)
            const data = await transactionServices.getTransactionsPartner(partnerID,page,pagesize)
            return Response(res,"Success",data,200)
        } catch (error) {
            console.log(error)
            return Response(res,"Không có giao dịch nào",null,400)
        }
    }
}
