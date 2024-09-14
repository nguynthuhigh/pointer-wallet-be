const {model,Schema} = require('mongoose')
const { Currency } = require('./wallet.model')

const valueSchema = new Schema({
    value: {
        type: Number,
        required: true,
        default: 0
    },
    dailyGrowthRate: {
        type: Number,
        required: true,
        default: 0
    }
})

const statisticSchema = new Schema({
    date:{
        type:Date,
        required:true,
        default: new Date(),
        unique:true
    },
    total_user: valueSchema,
    total_volume: valueSchema,
    total_partner: valueSchema,
    total_transaction: valueSchema
})
const volumeSchema= new Schema({
    date:{
        type:Date,
        required:true,
        default: new Date(),
        unique:true
    },
    value:[{
        currency:{
            type:String,
            required:true
        },
        value:{
            type:Number,
            required:true,
            default:0
        }
    }]
})
const TotalStatistic= model('TotalStatistic',statisticSchema)
const VolumeStatistic= model('VolumeStatistic',volumeSchema)

module.exports = {TotalStatistic,VolumeStatistic}