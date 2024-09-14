const {Schema, model} = require('mongoose')


const notificationTypeSchema = new Schema({
    typeName:{
        type:String,
        required:true
    }
})

const notificationSchema = new Schema({
    statusRead:{
        type:Boolean,
        required:true,
        default:false
    },
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    transactionID:{
        type:Schema.Types.ObjectId,
        ref:'Transaction',
        required: false
    },
    userID:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    NotificationTypeID:{
        type:Schema.Types.ObjectId,
        ref:'Notification',
        required:true
    }
},{
    timestamps:true
})

const Notification = model('Notification',notificationSchema)
const NotificationType= model('NotificationType',notificationTypeSchema)

module.exports = {Notification,NotificationType}