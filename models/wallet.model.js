const {Schema, model, SchemaTypes} = require('mongoose')
const cryptoJS = require('../utils/crypto-js')

const currencySchema = new Schema({
    symbol:{
        type: String,
        required:true,
        unique:true
    },
    name:{
        type: String,
        required:true,
        unique:true

    },
    image:{
        type:String,
        default:""
    }
},{
    timestamps: true 
})

const walletSchema = new Schema({
    address:{
        type:String,
        required:false,
    },
    mnemonic:{
        type:String,
        required:false,
        set:cryptoJS.encrypt,
    },
    balance:{
        type:Number,
        required:true,
        default:0
    },
    userID:{
        type:Schema.Types.ObjectId,
        required:false,
        ref:'User'
    },
    partnerID:{
        type:Schema.Types.ObjectId,
        required:false,
        ref:'Partner'
    },
    currencies:[{
        balance:{
            type:Number,
            default:0,
            required:true
        },
        currency:{
            type:Schema.Types.ObjectId,
            required:true,
            ref:'Currency',
        }
    }]
},{
    timestamps: true 
})

const Currency = model('Currency',currencySchema)
const Wallet= model('Wallet',walletSchema)

module.exports = {Wallet,Currency}
