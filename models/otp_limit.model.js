const {Schema,model} = require('mongoose')

const OTPSchema = new Schema({
    email: String,
    createdAt: { type: Date,default: Date.now, index: {expires: 3600 }}
})
const OTP_Limit = model('OTP_Limit',OTPSchema)
module.exports = {OTP_Limit}