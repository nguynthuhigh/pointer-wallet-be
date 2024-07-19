const {Schema, model} = require('mongoose')

const transactionSchema = new Schema({
    type:{
        type:String,
        required:true,
        enum:['transfer','payment','deposit','withdrawl'],
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
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:['pending','completed','fail'],
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
        required:true, 
        index:true
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
    userID:{
        type:String
    },
   
},{
    timestamps: true 
})


const Transaction= model('Transaction',transactionSchema)
module.exports = {Transaction}