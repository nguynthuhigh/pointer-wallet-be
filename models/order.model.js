const {Schema,model} = require('mongoose')

const OrderSchema = new Schema({
    email: String,
    otp: String,
    password:String,
    createdAt: { type: Date,default: Date.now, index: {expires: 180 }}
})
const OTP = model('OTP',OTPSchema)
module.exports = {OTP}