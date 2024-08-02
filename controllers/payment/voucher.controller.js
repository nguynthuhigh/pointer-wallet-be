const {Voucher} = require('../../models/voucher.model')
const {Response} = require('../../utils/response')
const voucherServices = require('../../services/voucher.servcies')
module.exports = {
    //voucher partner
    addVoucher : async (req,res) =>{
        try {
            const partnerID = req.partner
            const body = {
                ...req.body,
                partnerID: partnerID
            }
            const data = await voucherServices.addVoucher(body)
            return Response(res,"Success",data,200)
        } catch (error) {
            console.log(error)
            Response(res,"Fail",null,400)
        }
        
    },
    getVouchersPartner:async (req,res)=>{
        try {
            const {partnerID} = req.query
            const partnerVoucher = await voucherServices.getVouchersOfPartner(partnerID)
            if(!partnerVoucher){
                Response(res,"Partner has no voucher",null,200)
            }
            Response(res,"Success",partnerVoucher,200)
        } catch (error) {
            console.log(error)
            Response(res,"Fetch voucher error",null,400)
        }
    },
    getVouchers:async (req,res)=>{
        try {
            const partnerID = req.partner
            const partnerVoucher = await voucherServices.getVouchersOfPartner(partnerID)
            if(!partnerVoucher){
                Response(res,"Partner has no voucher",null,200)
            }
            Response(res,"Success",partnerVoucher,200)
        } catch (error) {
            console.log(error)
            Response(res,"Fetch voucher error",null,400)
        }
    },
    editVoucher:async(req,res)=>{
        try {
            const {voucherID} = req.body
            const data = await voucherServices.editVoucher(voucherID,req.body);
            return Response(res,"Success",data,200)
        } catch (error) {
            console.log(error)
            Response(res,"Edit voucher error",null,400)
        }

    },
    deleteVoucher:async(req,res)=>{
        try {
            const {voucherID} = req.body
            const data = await voucherServices.deleteVoucher(voucherID);
            return Response(res,"Success",data,200)
        } catch (error) {
            console.log(error)
            Response(res,"Edit voucher error",null,400)
        }
    },
    getVoucher:async(req,res)=>{
        try {
            const {voucherID} = req.query
            const data = await voucherServices.getDetailsVoucher(voucherID);
            return Response(res,"Success",data,200)
        } catch (error) {
             console.log(error)
            Response(res,"Get voucher error",null,400)
        }
    }
};