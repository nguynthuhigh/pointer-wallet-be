const {Response} = require("../utils/response");    
const {User} = require('../models/user.model'); 
const OTPservices = require('../services/OTP.services')
const {OTP} = require('../models/otp.model')
const bcrypt = require('../utils/bcrypt');
const nodemailer = require('../utils/nodemailer')
const jwt = require('../services/token.services')
const generateWallet = require('../services/wallet.services')
const wallet = require('../services/wallet.services')
module.exports  = {
    Register:async (req,res)=>{
        try {
            const {email,password} = req.body
            const user =await User.findOne({email:email})
            if(!user){
                try {
                    const passwordHash = bcrypt.bcryptHash(password)
                    //create OTP
                    const OTP = await OTPservices.createOTP(email,passwordHash)
                    //send nodemailer
                    await nodemailer.sendMail(email,"Mã OTP của bạn "+ OTP +" Nhập mã pay acc!","Chúng tôi đến từ pressPay!")
                    res.status(200).json({message:"Vui lòng kiểm tra email của bạn",email:email})
    
                } catch (error) {
                    res.status(400).json(error)
                }
            }
            else{
                return res.status(400).json({message:"Tài khoản đã tồn tại"})
            }
        } catch (error) {
            return Response(res,error,null,400)
        }
    },
    VerifyAccount:async(req,res)=>{
       try {
            const {email,otp} = req.body;
            const otpArray = await OTP.find({email:email})
            otpSchema=otpArray[otpArray.length-1]
            if(otpSchema){
                if(OTPservices.verifyOTP(otp,otpSchema.otp)){
                    //create new user
                    const user = await User.create({email:email,password:otpSchema.password})
                    //delete all OTP
                    await OTP.deleteMany({email:email})
                    //authorization 
                    const token =await jwt.createToken(user._id)
                    //create wallet
                    await wallet.createWallet(user._id,null)
                    return res.status(200).json({token:token,message:"Xác thực OTP thành công"})
                }
                else{
                    return res.status(400).json({message:"Không thể xác thực OTP vui lòng thử lại"})
                }
            }
            else{
                return res.status(400).json({message:"Mã OTP đã hết hạn vui lòng thử lại"})
            }

       } catch (error) {
            console.log(error)
            return res.status(400).json({erorr:error,message:"Mã OTP đã hết hạn vui lòng thử lại"})
       }
    },

    update_SecurityCode:async(req,res)=>{
        try {
            const code = bcrypt.bcryptHash(req.body.security_code)
            User.findByIdAndUpdate(req.user,{security_code:code}).then(data=>{
                Response(res,"Cập nhật mã bảo mật thành công",data,200)
            }).catch(error=>{
                Response(res,error,null,400)
            })
        } catch (error) {
            Response(res,error,null,400)
        }
    },
    Login: async(req,res)=>{
        try {
            const {email,password} = req.body;
            const userFind = await User.findOne({email:email})
            if(userFind){
                const passwordHash = userFind.password;
                if(bcrypt.bcryptCompare(password,passwordHash)){
                    const OTP = await OTPservices.createOTP(email,passwordHash)
                    nodemailer.sendMail(email,"Mã OTP đăng nhập của bạn là "+OTP +"\n Vui lòng không gửi cho bất kỳ ai.","Chúng tôi đến từ pressPay!")
                    res.status(200).json({message:"Kiểm tra email để xác nhận"})
                }
                else{
                    res.status(400).json({err, message:"Mật khẩu không đúng"})
                }
            }
            else{
                res.status(400).json({message:"Tài khoản hoặc mật khẩu không đúng"})
            }
        } catch (error) {
            res.status(400).json({error:error,message:"Tài khoản hoặc mật khẩu không đúng"})
        }
    },
    VerifyLogin:async(req,res)=>{
        const {email,otp} = req.body
        const otpArray = await OTP.find({email:email})
        otpSchema=otpArray[otpArray.length-1]
        if(otpSchema){
            if(OTPservices.verifyOTP(otp,otpSchema.otp)){
                await OTP.deleteMany({email:email})
                const dataUser = await User.findOne({email:email})
                const token =await jwt.createToken(dataUser._id)
                return res.status(200).json({token:token,message:"Xác thực OTP thành công"})
            }
            else{
                return res.status(400).json({message:"Không thể xác thực OTP vui lòng thử lại"})
            }
        }
        else{
            return res.status(400).json({message:"Mã OTP đã hết hạn vui lòng thử lại"})
        }
    },

}
