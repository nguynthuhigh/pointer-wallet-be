const {Partner} = require('../../models/partner.model')
const {OTP} = require('../../models/otp.model')
const OTPservices = require('../../services/OTP.services')
const jwt = require('../../services/token.services')
const bcrypt = require('../../utils/bcrypt')
const nodemailer = require('../../utils/nodemailer');
const {Response} = require('../../utils/response')
const wallet = require('../../services/wallet.services')
module.exports = {
    signUp:async(req,res)=>{
        const {email,password} = req.body
        const user =await Partner.findOne({email:email})
        const passwordHash = bcrypt.bcryptHash(password)
        if(!user){
            try {
                //create OTP
                const OTP = await OTPservices.createOTP(email,passwordHash)
                //send nodemailer
                nodemailer.sendMail(email,"Mã OTP của bạn "+ OTP ,"Chúng tôi đến từ pressPay!")
                Response(res,"Vui lòng kiểm tra email",null,200)

            } catch (error) {
                Response(res,error,null,400)
            }
        }
        else{
            return res.status(400).json({message:"Tài khoản đã tồn tại"})
        }
    },
    verifyAccount:async(req,res)=>{
        try {
            const {email,otp} = req.body;
            const otpArray = await OTP.find({email:email})
            otpSchema=otpArray[otpArray.length-1]
            if(otpSchema){
                if(OTPservices.verifyOTP(otp,otpSchema.otp)){
                    //create new user
                    const data = await Partner.create({email:email,password:otpSchema.password})
                    //delete all OTP
                    await OTP.deleteMany({email:email})
                    //authorization 
                    const token =await jwt.createToken(data._id)
                    //create wallet
                    wallet.createWallet(null,data._id)
                    Response(res,"Xác thực OTP thành công",token,200)
                }
                else{
                    Response(res,"Mã OTP không hợp lệ vui lòng thử lại",null,400)
                }
            }
            else{
                return res.status(400).json({message:"Mã OTP đã hết hạn vui lòng thử lại"})
            }

       } catch (error) {
            return res.status(400).json({erorr:error,message:"Mã OTP đã hết hạn vui lòng thử lại"})
       }
    },
    updateProfile:(req,res)=>{
        try {
            Partner.findByIdAndUpdate({id},req.body).then(data=>{
                return res.status(200).json({message:"Success",data:data})
            }).catch(err=>{
                return res.status(400).json({erorr:err})
            })
        } catch (error) {
            
        }
    }
}