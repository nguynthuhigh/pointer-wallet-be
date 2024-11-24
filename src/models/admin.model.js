const {Schema, model} = require('mongoose')

const adminSchema = new Schema({
    full_name:{
        type:String,
    },
    avatar:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:[true,'Email already exists']
    },
    password:{
        type:String,
        required:true
    },
    active:{
        type:Boolean,
        default:true
    },
    role:{
        type:[String],
        enum:['admin','support','finance']
    }
},{
    timestamps: true 
})
const Admin = model('Admin',adminSchema)
module.exports = {Admin}