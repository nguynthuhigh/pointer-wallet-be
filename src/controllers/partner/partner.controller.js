const {Response} = require('../../utils/response')
const {PartnerServices} = require('../../services/partner/partner.services')
const {Partner} = require('../../models/partner.model')
const transactionServices = require('../../services/transaction.services')
const {getRedisClient} = require('../../configs/redis/redis')
const upload = require('../../helpers/upload_cloudinary')
const catchError = require('../../middlewares/catchError.middleware')
module.exports = {
  getDashboard: catchError(async (req, res) => {
    const data = await PartnerServices.getDashboard(req.partner)
    return Response(res,'Success',data,200)
  }),
  editProfile: catchError(async (req,res)=>{
      const redis = getRedisClient()
      let url = null
      console.log(req.file)
      if (req.file && req.file.path) {
        url = await upload.upload(req.file.path);
      } 
      const data = {
        name:req.body.name,
        description: req.body.description,
        image:url
      }
      const partner = await Partner.updateOne({_id:req.partner},data,{new:true})
      redis.del(`partner:${req.partner._id}`)
      return Response(res,"Success",partner,200)
  }),
  getTransactions: catchError(async(req,res)=>{
    const partnerID = req.partner
    const {page,pagesize} = req.query
    const transactionData = await transactionServices.getTransactionsPartner(partnerID,page,pagesize)
    const page_count = Math.ceil(await transactionServices.countTransactionsPartner(partnerID)/pagesize)
    const data= {
        transaction:transactionData,
        page_count:page_count
    }
    return Response(res,"Success",data,200)
  })
}
