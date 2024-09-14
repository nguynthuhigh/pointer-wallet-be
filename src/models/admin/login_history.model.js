const {Schema, model} = require('mongoose')
const loginHistorySchema = new Schema({
    adminID: {
        type:Schema.Types.ObjectId,
        ref:'Admin'
    },
    ipAddress:{
        type:String
    }
},{
    timestamps: true 
})
const LoginHistory = model('LoginHistory',loginHistorySchema)
module.exports = {LoginHistory}