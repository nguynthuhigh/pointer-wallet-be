const {Schema, model} = require('mongoose')

const voucherSchema = new Schema({
    title:{
        type:String,
    },
    content:{
        type:String,
    },
    quantity:{
        type:Number,
    },
    usedCount:{
        type:Number,
        required:true,
        default:0
    },
    exprirationDate:{
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
    condition:{
        min:{
            type:Number,
            required:true
        },
        max:{
            type:Number,
            required:true
        },
    }
},{
    timestamps:true
})
const Voucher= model('Promotion',voucherSchema)
module.exports = {Voucher}