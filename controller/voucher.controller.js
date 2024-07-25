const {Voucher} = require('../models/voucher.model')
const {Response} = require('../utils/response')
const voucherServices = require('../services/voucher.servcies')
module.exports = {
    //voucher partner
    addVoucher : (req,res) =>{
        const partnerID = req.partner
        const body = {
            ...req.body,
            partnerID: partnerID
        }
        Voucher.create(body).then(result => {
            Response(res,"Success",result,200)
        })
        .catch(error => {
            Response(res,error,null,400)
        })
    },
    getVouchersPartner:async (req,res)=>{
        try {
            const {partnerID} = req.query
            const partnerVoucher = await voucherServices.getVouchersOfPartner(partnerID)
            if(!voucherServices){
                Response(res,"Partner has no voucher",null,400)
            }
            Response(res,"Success",partnerVoucher,200)
        } catch (error) {
            console.log(error)
            Response(res,"Fetch voucher error",null,400)
        }
    },
 
};