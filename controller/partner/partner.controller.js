const {Response} = require('../../utils/response')
const partner = require('../../services/partner/partner.services')
module.exports = {
    getInfo:async (req,res)=>{
        try {
            const data = await partner.getInfo(req.partner)
            return Response(res,"Success",data,200)
        } catch (error) {
            return Response(res,error,null,400)
        }
    },
    updateInfo:async (req,res)=>{
        try {
            
        } catch (error) {
            return Response(res,error,null,400)
        }
    }
}