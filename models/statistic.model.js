const {model,Schema} = require('mongoose')

const valueSchema = new Schema({
    value: {
        type: Number,
        required: true
    },
    dailyGrowthRate: {
        type: Number,
        required: true
    }
})

const statisticSchema = new Schema({
    total_user: valueSchema,
    total_users_rate: valueSchema,
    total_partner: valueSchema,
    total_transaction: valueSchema
})
const volumeSchema= new Schema({
    year:{
        type:Number,
        required:true
    },
    months:{
        month:{
            type:Number,
            required:true
        },
        days:[{
            day:{
                type:Number,
                required:true
            },
            data:{
                type:Number,
                required:true
            }
        }]
    }
})
const Statistic= model('Statistic',statisticSchema)
const VolumeStatistic= model('VolumeStatistic',volumeSchema)

module.exports = {Statistic,VolumeStatistic}