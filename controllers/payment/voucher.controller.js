const {Response} = require('../../utils/response')
const voucherServices = require('../../services/voucher.services')
const uploadImage = require('../../helpers/upload_cloudinary')
module.exports = {
    //voucher partner
    addVoucher : async (req,res) =>{
        try {
            const voucher = await voucherServices.getVoucherByCode(req.body.code)
            if(voucher){
                return Response(res,"CODE Voucher already exists",null,400)
            }
            console.log(req.file.path)
            const url =  await uploadImage.upload(req.file.path)
            const partnerID = req.partner
            const body = {
                ...req.body,
                partnerID: partnerID,
                image:url,
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
            return Response(res,"Success",partnerVoucher,200)
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