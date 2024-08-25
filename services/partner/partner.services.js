const {Partner} = require('../../models/partner.model')
const redis = require('../../helpers/redis.helpers')
const walletServices = require('../wallet.services')
const bcrypt = require('../../utils/bcrypt')
const AppError = require('../../helpers/handleError')
const jwt = require('../token.services')
const OTPServices = require('../OTP.services')
class PartnerServices{
    static findPartnerById = async (id)=>{
        const partner = await Partner.findById(id)
        if(!partner){
            throw new AppError("Unauthorized",401)
        }
        return partner
    }
    static getDashboard = async(partner)=>{
        const data = await redis.get(`partner:${partner._id}`)
        if(data){
            const parsedData = JSON.parse(data);
            return {
                partner: parsedData.partner,
                wallet: parsedData.wallet
            };
        }
        const wallet = await walletServices.getPartnerWallet(partner._id)
        await redis.set(`partner:${partner._id}`,
            JSON.stringify({
                partner: partner,
                wallet: wallet
            }),600)
        return {
            partner: partner,
            wallet: wallet
        }
    }
}
module.exports= {
    PartnerServices,
   
    getInfo:async (partnerID)=>{
        try {
            const partner = await Partner.findById(partnerID);
            return partner
        } catch (error) {
            throw(error)
        }
    },
    updateInfo:async(partnerID,info)=>{
        try {
            const partner = await Partner.findByIdAndUpdate(partnerID,info,{new:true});
            return partner
        } catch (error) {
            throw(error)
        }
    },
}