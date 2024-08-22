const {Partner} = require('../../models/partner.model')
const redis = require('../../helpers/redis.helpers')
const walletServices = require('../wallet.services')
const bcrypt = require('../../utils/bcrypt')
const AppError = require('../../helpers/handleError')
const jwt = require('../../services/token.services')
class PartnerServices{
    static signIn = async(email,password)=>{
        const partnerFind = await Partner.findOne({email:email})
        if(!partnerFind){
            throw new AppError("Tài khoản hoặc mật khẩu không đúng",400)
        }
        const passwordHash = partnerFind.password;
        if(!bcrypt.bcryptCompare(password,passwordHash)){
            throw new AppError("Tài khoản hoặc mật khẩu không đúng",400)
        }
        const token =await jwt.createToken(partnerFind._id)
        return token
    }
}
module.exports= {
    PartnerServices,
    getDashboard:async(partner)=>{
        try {
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
        } catch (error) {
            console.log(error)
            throw error
        }
    },
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