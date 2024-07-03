const {Schema, model} = require('mongoose')

const promotionTypeSchema= new Schema({
    typeName:{
        type:String,
        required:true
    }
})

const promotionSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    usedCount:{
        type:Number,
        required:true,
        default:0
    },
    exprirationDate:{
        type:Date,
        required:true
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
    promotionTypeID:{
        type:Schema.Types.ObjectId,
        ref:'PromotionType',
        required:true,
    }
},{
    timestamps:true
})

const userPromotionSchema = new Schema({
    promotionID:{
        type:Schema.Types.ObjectId,
        ref:'Promotion',
        required:true,
    },
    userID:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
},{
    timestamps:true
})


const PromotionType = model('PromotionType',promotionTypeSchema)
const Promotion= model('Promotion',promotionSchema)
const UserPromotion = model('UserPromotion',userPromotionSchema)

module.exports = {PromotionType,Promotion,UserPromotion}