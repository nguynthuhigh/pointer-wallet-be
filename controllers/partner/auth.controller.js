const {Partner} = require('../../models/partner.model')
const OTPservices = require('../../services/OTP.services')
const bcrypt = require('../../utils/bcrypt')
const nodemailer = require('../../utils/nodemailer');
const {Response} = require('../../utils/response')
const {OTP_Limit} = require('../../models/otp_limit.model')
const catchError = require('../../middlewares/catchError.middleware')
const  AuthPartnerServices = require('../../services/partner/auth.services');
module.exports = {
    signUp:catchError(async(req,res)=>{
        const {email,password} = req.body
        const otp = await AuthPartnerServices.signUp(email,password)
        nodemailer.sendMail(email,"Mã OTP của bạn "+ otp ,"Chúng tôi đến từ pressPay!")
        Response(res,"Vui lòng kiểm tra email",null,200)
    }),
    verifyAccount:catchError(async(req,res)=>{
        const {email,otp} = req.body;
        const {refreshToken,accessToken} = await AuthPartnerServices.verifySignUp(email,otp)
        res.cookie("refresh_token", refreshToken, {
            httpOnly:true,
            sameSite:'none',
            secure:true,
            path:'/',
            maxAge:60*60*24*15*1000
          });
        res.cookie("access_token", accessToken, {
            httpOnly:true,
            sameSite:'none',
            secure:true,
            path:'/',
            maxAge:60*60*24*15*1000
            });
        res.status(200).json({message:"success",token:token})
    }),
    //using multer!
    updateProfile: catchError(async(req,res)=>{
        const id = req.partner._id
        await Partner.findByIdAndUpdate({id},req.body)
        return Response(res,"Update profile successfully",null,200)
    }),
    signIn: catchError(async(req,res)=>{  
        const {email,password} = req.body;
        const {refreshToken,accessToken} = await AuthPartnerServices.signIn(email,password)
        res.cookie("refresh_token", refreshToken, {
            httpOnly:true,
            sameSite:'none',
            secure:true,
            path:'/',
            maxAge:60*60*24*15*1000,
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
          });
        res.cookie("access_token", accessToken, {
            httpOnly:true,
            sameSite:'none',
            secure:true,
            path:'/',
            maxAge:60*60*24*15*1000,
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
            });
        return Response(res,"Đăng nhập thành công",null,200)
   }),
   refreshToken: catchError(async (req,res)=>{
        const refreshToken = req.cookies['refresh_token']
        
   }),
   ResendEmail: catchError(async(req,res)=>{
        const {email,password} = req.body
        const user =await Partner.findOne({email:email})
        if(user){
            return res.status(400).json({message:"Account already exists"})
        }
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
    })
}
