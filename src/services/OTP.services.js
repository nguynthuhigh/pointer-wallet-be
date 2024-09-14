const AppError = require('../helpers/handleError');
const {OTP} = require('../models/otp.model')
const {OTP_Limit} = require('../models/otp_limit.model')
const bcrypt = require('../utils/bcrypt');
const otpGenerator = require('otp-generator')
module.exports = {
    createOTP:async(email,passwordHash)=>{
        const OTP_Generator = otpGenerator.generate(6, {digits:true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
        const hash = bcrypt.bcryptHash(OTP_Generator)
        await OTP.create({email: email,password:passwordHash,otp: hash})
        console.log(OTP_Generator)
        return OTP_Generator
    },
    verifyOTP:async(email,otp)=>{
        const otpArray = await OTP.find({email:email})
        otpSchema=otpArray[otpArray.length-1]
        if(!otpSchema){
            throw new AppError("Mã OTP không hợp lệ",400)
        }
        const result = bcrypt.bcryptCompare(otp,otpSchema.otp);
        if(!result){
            throw new AppError("Mã OTP không hợp lệ",400)
        }
        await OTP.deleteMany({email:email})
        return otpSchema.password
    },
    countOTP:async (email)=>{
        const count = await OTP_Limit.countDocuments({email:email});
        return count
    },
    addToken:async (body)=>{
        try {
            return await OTP.create(body)
        } catch (error) {
            console.log(error)
            throw error
        }
    },
    findOTP:async(body)=>{
        try {
            return await OTP.find(body)
        } catch (error) {
            console.log(error)
            throw error 
        }
    },
}