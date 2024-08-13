const {Response} = require('../../utils/response')
const partner = require('../../services/partner/partner.services')
const {Partner} = require('../../models/partner.model')
const transactionServices = require('../../services/transaction.services')
const {getRedisClient} = require('../../configs/redis/redis')
const walletServices = require('../../services/wallet.services')
const upload = require('../../helpers/upload_cloudinary')
module.exports = {
   getDashboard: async (req, res) => {
      const redis = getRedisClient();
      try {
        const partnerKey = `partner:${req.partner._id}`
        const partnerData = await redis.hgetall(partnerKey)
        if (Object.keys(partnerData).length === 0) {
          const wallet = await walletServices.getPartnerWallet(req.partner._id)
          const data = { partner: req.partner, wallet }
          await redis.hset(partnerKey, {
            partnerInfo: JSON.stringify(req.partner),
            walletInfo: JSON.stringify(wallet),
          });
          await redis.expire(partnerKey, 600);
          return Response(res, 'Success', data, 200)
        } 
        if (partnerData) {
          const partnerInfo = JSON.parse(partnerData.partnerInfo)
          const walletInfo = JSON.parse(partnerData.walletInfo)
          const data = { partner: partnerInfo, wallet: walletInfo }
          return Response(res, 'Success', data, 200)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    },
    updateInfo:async (req,res)=>{
        const redis = getRedisClient()
        try {
          let url = null
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
        } catch (error) {
            console.log(error)
            return Response(res,error,null,400)
        }
    },
    getTransactions:async(req,res)=>{
        try {
            const partnerID = req.partner
            const {page,pagesize} = req.query
            const transactionData = await transactionServices.getTransactionsPartner(partnerID,page,pagesize)
            const page_count = Math.ceil(await transactionServices.countTransactionsPartner(partnerID)/pagesize)
            const data= {
                transaction:transactionData,
                page_count:page_count
            }
            return Response(res,"Success",data,200)
        } catch (error) {
            console.log(error)
            return Response(res,"Không có giao dịch nào",null,400)
        }
    }
}
