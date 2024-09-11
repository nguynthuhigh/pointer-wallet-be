const {Schema, model} = require('mongoose')

const postSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    userID: {
        type:Schema.Types.ObjectId,
        ref:'User'
    }
},{
    timestamps: true 
})

const replyPostSchema = new Schema({
    comment:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    postID:{
        type:Schema.Types.ObjectId,
        ref:'Post',
        required:true
    },
    userID:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{
    timestamps: true 
})

const Post = model('Post',postSchema)
const replyPost = model('replyPost',replyPostSchema)

module.exports = {Post,replyPost}