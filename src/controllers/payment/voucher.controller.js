const {Response} = require('../../utils/response')
const voucherServices = require('../../services/voucher.services')
const uploadImage = require('../../helpers/upload_cloudinary')
const catchError = require('../../middlewares/catchError.middleware')
const walletServices = require('../../services/wallet.services')
module.exports = {
    addVoucher:catchError( async (req,res) =>{
        await voucherServices.hasVoucherByCode(req.body.code)
        const getCurrency = await walletServices.getCurrency(req.body.currency)
        const url =  await uploadImage.upload(req?.file?.path)
        const partnerID = req.partner
        const body = {
            ...req.body,
            partnerID: partnerID,
            image:url,
            currency:getCurrency._id
        }
        const data = await voucherServices.addVoucher(body)
        return Response(res,"Success",data,200)
    }),
    getVouchersPayment:catchError(async (req,res)=>{
        const {partnerID} = req.query
        const partnerVoucher = await voucherServices.getVouchersOfPartner(partnerID)
        Response(res,"Success",partnerVoucher,200)
    }),
    getVouchersPartner:catchError(async (req,res)=>{
        const partnerID = req.partner
        const partnerVoucher = await voucherServices.getVouchersOfPartner(partnerID)
        return Response(res,"Success",partnerVoucher,200)
    }),
    editVoucher:catchError(async(req,res)=>{
        const {voucherID} = req.body
        const data = await voucherServices.editVoucher(voucherID,req.body);
        return Response(res,"Success",data,200)
    }),
    deleteVoucher:catchError(async(req,res)=>{
        console.log(req.body)
        const {voucherID} = req.body
        const data = await voucherServices.deleteVoucher(voucherID);
        return Response(res,"Success",data,200)
    }),
    getVoucher:(async(req,res)=>{
        const {voucherID} = req.query
        const data = await voucherServices.getDetailsVoucher(voucherID);
        return Response(res,"Success",data,200)
    })
};