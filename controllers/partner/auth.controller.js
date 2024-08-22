const {Partner} = require('../../models/partner.model')
const {OTP} = require('../../models/otp.model')
const OTPservices = require('../../services/OTP.services')
const bcrypt = require('../../utils/bcrypt')
const nodemailer = require('../../utils/nodemailer');
const {Response} = require('../../utils/response')
const wallet = require('../../services/wallet.services')
const crypto = require('../../utils/crypto-js')
const {OTP_Limit} = require('../../models/otp_limit.model')
const catchError = require('../../middlewares/catchError.middleware')
const { PartnerServices } = require('../../services/partner/partner.services')
module.exports = {
    //need review
    signUp:catchError(async(req,res)=>{
        const {email,password} = req.body
        const user =await Partner.findOne({email:email})
        const passwordHash = bcrypt.bcryptHash(password)
        //create OTP
        const OTP = await OTPservices.createOTP(email,passwordHash)
        //send nodemailer
        nodemailer.sendMail(email,"Mã OTP của bạn "+ OTP ,"Chúng tôi đến từ pressPay!")
        Response(res,"Vui lòng kiểm tra email",null,200)
    }),
    verifyAccount:async(req,res)=>{
        try {
            const {email,otp} = req.body;
            const otpArray = await OTP.find({email:email})
            otpSchema=otpArray[otpArray.length-1]
            if(otpSchema){
                if(OTPservices.verifyOTP(otp,otpSchema.otp)){
                    const key = crypto.generateKeyPair()
                    //create new user
                    const data = await Partner.create({email:email,password:otpSchema.password,publicKey:key.publicKey,privateKey:key.privateKey})
                    //delete all OTP
                    await OTP.deleteMany({email:email})
                    //authorization 
                    const token =await jwt.createToken(data._id)
                    //create wallet
                    await wallet.createWallet(data._id,"partner")
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
            return res.status(400).json({error:error,message:"Không thể xác thực vui lòng thử lại"})
       }
    },
    updateProfile:(req,res)=>{
        try {
            Partner.findByIdAndUpdate({id},req.body).then(data=>{
                return res.status(200).json({message:"Success",data:data})
            }).catch(err=>{
                return res.status(400).json({error:err})
            })
        } catch (error) {
            
        }
    },
   signIn:catchError(async(req,res)=>{  
        const {email,password} = req.body;
        const data = await PartnerServices.signIn(email,password)
        return Response(res,"Đăng nhập thành công",data,200)
   })
   ,ResendEmail:async(req,res)=>{
    try {
        const {email,password} = req.body
        const user =await Partner.findOne({email:email})
        if(!user){
            try {
              
                const count = await OTPservices.countOTP(email)
                if(count < 3){
                    const passwordHash = bcrypt.bcryptHash(password)
                    console.log(passwordHash)
                    const OTP = await OTPservices.createOTP(email,passwordHash)
                    console.log(OTP)
                    await OTP_Limit.create({email:email})
                    await nodemailer.sendMail(email,"Mã OTP của bạn "+ OTP +" Vui lòng không gửi cho bất kì ai","Chúng tôi đến từ pressPay!")
                    return Response(res,"Check your email","",200)
                }else{
                    return Response(res,"Please try again after 1 hour","",400)
                }

            } catch (error) {
                res.status(400).json(error)
            }
        }
        else{
            return res.status(400).json({message:"Your account already exists"})
        }
    } catch (error) {
        console.log(error)
        Response(res,"Error, please try again","",400)
    }
}, Auth:()=>{
    Response(res,"ok",null,200)
}
}
