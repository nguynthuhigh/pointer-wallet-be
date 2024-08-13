const {Schema, model} = require('mongoose')

const voucherSchema = new Schema({
    title:{
        type:String,
    },
    image:{
        type:String
    },
    content:{
        type:String,
    },
    code:{
        type:String,
        unique: true
    },
    quantity:{
        type:Number,
        min:0
    },
    usedCount:{
        type:Number,
        required:true,
        default:0
    },
    expiredDate:{
        type:Date,
    },
    statusPublic:{
        type:Boolean,
        required:true,
        default:false
    },
    discountValue:{
        type:Number,
        required:true
    },
    type:{
        type:String,
        enum:['discount_amount','discount_percent',],
        required:true,
    },
    min_condition:{
        type:Number,
        required:true
    },
    max_condition:{
        type:Number,
    },
    partnerID:{
        type:Schema.Types.ObjectId,
        require:true
    }
    
},{
    timestamps:true
})
const Voucher= model('Voucher',voucherSchema)
module.exports = {Voucher}