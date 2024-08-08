const {Response} = require('../../utils/response')
const partner = require('../../services/partner/partner.services')
const {Partner} = require('../../models/partner.model')
const transactionServices = require('../../services/transaction.services')
const {getRedisClient} = require('../../configs/redis/redis')
const walletServices = require('../../services/wallet.services')
const cloudinary = require('../../configs/cloudinary/cloudinary')
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
            cloudinary.uploader.upload(req.file.path,async(result,err)=>{
                if(err){
                  console.log(err)
                  return Response(res,"Cập nhật ảnh thất bại",null,200)
                }
                const data = {
                  name:req.name,
                  description: req.description,
                  image:result.url
                }
                const partner = await Partner.findByIdAndUpdate(req.partner,data,{new:true})
                redis.del(`partner:${req.partner._id}`)
                return Response(res,"Cập nhật thành công",partner,200)
            })
        } catch (error) {
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
