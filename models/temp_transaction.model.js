const {Schema, model} = require('mongoose')

const transactionSchema = new Schema({
    type:{
        type:String,
        required:true,
        enum:['transfer','payment','deposit','withdrawl']
    },
    amount:{
        type:Number,
        required:true,
    },
    title:{
        type:String,
        required:false,
    },
    sender:{
        type:Schema.Types.ObjectId,
        ref:'User',
    },
    message:{
        type:String,
        required:true,
    },
    currency:{
        type:Schema.Types.ObjectId,
        ref:'Currency',
        required:true, 
    },
    partnerID:{
        type:Schema.Types.ObjectId,
        ref:'Partner',
        required:false
    },
    completedAt: { type: Date,default:new Date(),index: { expireAfterSeconds: 600 } },
    userID:{
        type:String
    },
},{
    timestamps: true 
})

const Transaction_Temp= model('Transaction_Temp',transactionSchema)
module.exports = {Transaction_Temp}