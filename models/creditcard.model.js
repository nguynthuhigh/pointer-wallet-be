const {Schema, model} = require('mongoose')
const cryptoJS = require('../utils/crypto-js')
const creaditCardSchema = new Schema({
    name:{
        type: String,
        set:cryptoJS.encrypt,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    cvv: {
        type: String,
        set:cryptoJS.encrypt,
    },
    expiryMonth: {
        type: String,
        set:cryptoJS.encrypt,
        required: true
    },
    expiryYear: {
        type: String,
        set:cryptoJS.encrypt,
        required: true
    },
    userID: {type:Schema.Types.ObjectId, ref:'User'}
},{
    timestamps: true 
})
const CreditCard = model('CreditCard',creaditCardSchema)
module.exports = {CreditCard}
