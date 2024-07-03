const {Schema,model} = require('mongoose')

const OTPSchema = new Schema({
    email: String,
    otp: String,
    password:String,
    createdAt: { type: Date,default: Date.now, index: {expires: 60 }}
})
const OTP = model('OTP',OTPSchema)
module.exports = {OTP}