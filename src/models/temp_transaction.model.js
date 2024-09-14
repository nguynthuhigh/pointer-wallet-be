const {Schema, model} = require('mongoose')

const transactionSchema = new Schema({
    type:{
        type:String,
        enum:['transfer','payment','deposit','withdrawl']
    },
    amount:{
        type:Number,
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
    },
    currency:{
        type:Schema.Types.ObjectId,
        ref:'Currency',
    },
    partnerID:{
        type:Schema.Types.ObjectId,
        ref:'Partner',
        required:false
    },
    status:{
        type:String,
        required:true,
        enum:['pending','completed','fail'],
        default:"pending"
    },
    createdAt: { type: Date,default: Date.now, index: { expireAfterSeconds: 60, partialFilterExpression: { status: 'pending' } }},
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
