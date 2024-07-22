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
    createdAt: { type: Date,default: Date.now, index: {expires: 600 }},
    userID:{
        type:String
    },
    url:{
        type:String
    }
},{
    timestamps: true,
    collection:'transaction_temps'
})

const Transaction_Temp= model('Transaction_Temp',transactionSchema)
module.exports = {Transaction_Temp}
