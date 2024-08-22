const {Schema, model} = require('mongoose')

const keySchema = new Schema({
    userID:{
        type:Schema.Types.ObjectId,
        ref:'User',
        index:true
    },
    partnerID:{
        type:Schema.Types.ObjectId,
        ref:'Admin',
        index:true
    },
    adminID:{
        type:Schema.Types.ObjectId,
        ref:'Partner',
        index:true
    },
    private_key:{
        type:String
    },
    public_key:{
        type:String
    },
    refresh_token:{
        type:String,
        required:true
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