const {Response} = require("../../utils/response");    
const nodemailer = require('../../utils/nodemailer')
const catchError = require('../../middlewares/catchError.middleware')
const AuthServices = require('../../services/auth.services');
const { setCookie } = require("../../utils/cookie");
module.exports  = {
    Register: catchError(async (req,res)=>{
        const data = await AuthServices.registerAccount(req.body)
        const {email,OTP} = data
        await nodemailer.sendMail(email,"Mã OTP của bạn "+ OTP +" Vui lòng không gửi cho bất kì ai","Chúng tôi đến từ pressPay!")
        return Response(res,"Vui lòng kiểm tra email của bạn",email,200)
    }),
    VerifyAccount: catchError(async(req,res)=>{
        const {email,otp} = req.body
        const data = await AuthServices.verifyRegister(email,otp)
        return Response(res,"Đăng ký thành công",data,200)

    }),
    updateSecurityCode: catchError(async(req,res)=>{
        await AuthServices.updateSecurityCode(req.body.security_code,req.user)
        return Response(res,"Cập nhật mã bảo mật thành công",null,200)
    }),
    Login: catchError( async(req,res)=>{
        const {OTP,email} = await AuthServices.loginAccount(req.body)
        nodemailer.sendMail(email,"Mã OTP đăng nhập của bạn là "+OTP +"\n Vui lòng không gửi cho bất kỳ ai.","Chúng tôi đến từ pressPay!")
        return Response(res,"Kiểm tra email để xác nhận",null,200)
    }),
    VerifyLogin: catchError(async(req,res)=>{
        const {accessToken,refreshToken} = await AuthServices.verifyLogin(req.body)
        setCookie(res,accessToken,"access_token")
        setCookie(res,refreshToken,"refresh_token")
        return Response(res,"Đăng nhập thành công",null,200)
    }),
    Logout: catchError(async(req,res)=>{
        await AuthServices.logoutAccount(req.body.refreshToken)
        Response(res,"Logout Success",null,200)
    }),
    refreshTokenAccess: catchError(async(req,res)=>{
        const {accessToken,refreshToken} = await AuthServices.refreshTokenAccess(req.cookies['refresh_token'])
        setCookie(res,accessToken,"access_token")
        setCookie(res,refreshToken,"refresh_token")
        return Response(res,"refresh token success",null,200)
    }),
    resendEmail:async(req,res)=>{
        // try {
        //     const {email,password} = req.body
        //     const user =await userServices.getUserByEmail(email)
        //     if(user){
        //         return Response(res,"Tài khoản đã tồn tại",null,400)
        //     }
        //     const count = await OTPservices.countOTP(email)
        //     if(count > 2){
        //         return Response(res,"Please try again after 1 hour","",400)
        //     }
        //     const passwordHash = bcrypt.bcryptHash(password)
        //     const OTP = await OTPservices.createOTP(email,passwordHash)
        //     await OTP_Limit.create({email:email})
        //     await nodemailer.sendMail(email,"Mã OTP của bạn "+ OTP +" Vui lòng không gửi cho bất kì ai","Chúng tôi đến từ pressPay!")
        //     return Response(res,"Check your email","",200)
        // } catch (error) {
        //     console.log(error)
        //     Response(res,"Error, please try again","",500)
        // }
    },
    requestResetPassword:async(req,res)=>{
        // try {
        //     const {email} = req.body
        //     const user = await userServices.getUserByEmail(email) 
        //     if(!user){
        //         return Response(res,"Không tìm thấy người dùng",null,400)
        //     }
        //     const token = crypto.encrypt(email)
        //     await OTPservices.addToken({email:email,otp:token})
        //     nodemailer.sendMail(email,`${process.env.WALLET_HOST}/forgot-password?token=${token}`,`[pressPay] Đặt lại mật khẩu`)
        //     return Response(res,"Vui lòng kiểm tra email để xác nhận",null,200)
            
        // } catch (error) {
        //     console.log(error)
        //     Response(res,"Error, please try again","",500)
        // }
    },
    resetPassword:async(req,res)=>{
        // try {
        //     const {password,token} = req.body
        //     const data = await OTPservices.findOTP({otp:token})
        //     if(!data){
        //         return Response(res,"Không thể reset password",null,400)
        //     }
        //     const user = await userServices.resetPasswordUser(data.email,password)
        //     if(user.modifiedCount = 0){
        //         return Response(res,"Khôi phục mật khẩu thất bại, vui lòng thử lại",null,400)
        //     }
        //     return Response(res,"Khôi phục mật khẩu thành công!",null,200)

        // } catch (error) {
        //     console.log(error)
        //     Response(res,"Error, please try again","",500)
        // }
    }
  
}
