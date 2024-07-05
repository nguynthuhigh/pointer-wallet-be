const {Response} = require('../../utils/response')
const partner = require('../../services/partner/partner.services')
const {Partner} = require('../../models/partner.model')
const {Wallet} = require('../../models/wallet.model')
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
            
        } catch (error) {
            return Response(res,error,null,400)
        }
    }
}