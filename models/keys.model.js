const {Schema, model} = require('mongoose')

const keySchema = new Schema({
    userID:{
        type:Schema.Types.ObjectId,
        ref:'User',
    },
    partnerID:{
        type:Schema.Types.ObjectId,
        ref:'Admin',
    },
    adminID:{
        type:Schema.Types.ObjectId,
        ref:'Partner',
    },
    refresh_token:{
        type:String,
        required:true,
        index:true
    },
    refresh_token_used:[{
        type:String,
        required:true
    }],
    createdAt: { type: Date,default: Date.now, index: {expires: 60*60*24*14 }}
},{
    timestamps: true 
})
const Key = model('key',keySchema)
module.exports = Key