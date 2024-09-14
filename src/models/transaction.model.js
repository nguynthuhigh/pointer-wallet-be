const {Schema, model} = require('mongoose')

const transactionSchema = new Schema({
    type:{
        type:String,
        required:true,
        enum:['transfer','payment','deposit','withdraw',],
        index:true
    },
    amount:{
        type:Number,
        required:true,
    },
    title:{
        type:String,
        required:false,
    },
    message:{
        type:String,
    },
    status:{
        type:String,
        required:true,
        enum:['pending','completed','fail','refund'],
        default:"pending"
    },
    currency:{
        type:Schema.Types.ObjectId,
        ref:'Currency',
        required:true, 
    },
    sender:{
        type:Schema.Types.ObjectId,
        ref:'User',
    },
    receiver:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:false,
        index:true
    },
    partnerID:{
        type:Schema.Types.ObjectId,
        ref:'Partner',
        required:false
    },
    creditcard:{
        type:Schema.Types.ObjectId,
        ref:'CreditCard',
        required:false
    },
    voucherID:{
        type:Schema.Types.ObjectId,
        ref:'Voucher',
        required:false
    },
    userID:{
        type:String
    },
    return_url:{
        type:String
    },
    orderID:{
        type:String
    }
},{
    timestamps: true 
})


const Transaction= model('Transaction',transactionSchema)
module.exports = {Transaction}