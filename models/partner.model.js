const {Schema, model} = require('mongoose')


const partnerSchema = new Schema({
    brandName:{
        type:String,
    },
    description:{
        type:String,
    },
    image:{
        type:String,
        default:'../assets/img.png'
    },
    phone:{
        type:String,
    },
    address:{
        type:String,
    },
    email:{
        type:String,
        required:true
    },
    inactive:{
        type:Boolean,
        default:false
    }
},{
    timestamps: true 
})

const Partner = model('Partner',partnerSchema)
module.exports = {Partner}

