const {model,Schema} = require('mongoose')

const statisticSchema = new Schema({
    total_users:{
        type:Number,
        required:true
    },
    total_partners:{
        type:Number,
        required:true
    },
    total_transactions:{
        type:Number,
        required:true
    },
    total_volumn:{
        type:String,
        required:true
    }
})
const volumnSchema= new Schema({
    day:{
        type:Number,
        required:true
    },
    month:{
        type:Number,
        required:true
    },
    year:{
        type:Number,
        required:true
    },
    value:{
        type:Number,
        required:true,
    }
})
module.exports = model('Statistic',statisticSchema)