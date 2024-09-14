const {Response} = require('../../utils/response')
const partnerManagementServices = require('../../services/admin/partner_management.services')
module.exports = {
    getPartners:async(req,res)=>{
        try {
            const {page, page_limit} = req.query
            const data = await partnerManagementServices.getPartners(page,page_limit)
            Response(res,"Success",data,200)
        } catch (error) {
            console.log(error)
            Response(res,"Error System",null,500)
        }
    },
    getDetailsPartner:async(req,res)=>{
        try {
            const {id} = req.query
            const data = await partnerManagementServices.getDetailsPartner(id)
            Response(res,"Success",data,200)
        } catch (error) {
            console.log(error)
            Response(res,"Error System",null,500)
        }
    },
    getTransactionsPartner:async(req,res)=>{
        try {
            const {id,page,page_limit} = req.query
            const data = await partnerManagementServices.getTransactionsPartner(id,page,page_limit)
            Response(res,"Success",data,200)
        } catch (error) {
            console.log(error)
            Response(res,"Error System",null,500)
        }
    },
}