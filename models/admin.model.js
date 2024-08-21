const {Schema, model} = require('mongoose')

const adminSchema = new Schema({
    full_name:{
        type:String,
    },
    avatar:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwzw_Ti47ovNmMbRwz3HaY7hDhHFeAmER6kw&s"
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        select:false,
        required:true
    },
    active:{
        type:Boolean,
        default:true
    },
    role:[{
        type:String,
        enum:['admin','support','finance']
    }]
},{
    timestamps: true 
})
const Admin = model('Admin',adminSchema)
module.exports = {Admin}