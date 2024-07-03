const {Schema, model} = require('mongoose')

const userSchema = new Schema({
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
    },
    inactive:{
        type:Boolean,
        required:true,
        default:false
    },
},{
    timestamps: true 
})
const User = model('User',userSchema)
module.exports = {User}