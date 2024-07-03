const {OTP} = require('../models/otp.model')
const bcrypt = require('../utils/bcrypt');
const otpGenerator = require('otp-generator')
module.exports = {
    createOTP:async(email,passwordHash)=>{
        try {
            const OTP_Generator = otpGenerator.generate(6, {digits:true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
            const hash = bcrypt.bcryptHash(OTP_Generator)
            await OTP.create({email: email,password:passwordHash,otp: hash})
            console.log(OTP_Generator)
            return OTP_Generator
        } catch (error) {
            return console.log(error)
        }
    },
    verifyOTP:(otp,hash)=>{
        return bcrypt.bcryptCompare(otp, hash);
    }
}