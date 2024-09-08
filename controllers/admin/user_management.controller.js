const {User} = require('../../models/user.model')
const {Response} = require('../../utils/response')
const userServices = require('../../services/user.services')
const userManagementServices = require('../../services/admin/user_management.services')
const {getRedisClient} = require('../../configs/redis/redis')
const uploadImage = require('../../helpers/upload_cloudinary')
const catchError = require('../../middlewares/catchError.middleware')
module.exports = {
    //admin
    getUsers:catchError(async(req,res)=>{
        const {page,page_limit}= req.query
        const data = await userManagementServices.getUsers(page,page_limit)
        Response(res,"Success",data,200)
    }),
    banUser:async(req,res)=>{
        try {
            const {id} = req.body
            const data = await userManagementServices.banUser(id)
            if(data.modifiedCount === 0){
                return Response(res,"Fail, try again",null,400)
            }
            if(data.active === true){
                return Response(res,"User successfully unbanned",null,200)
            }else{
                return Response(res,"User successfully banned",null,200)
            }
        } catch (error) {
            console.log(error)
            Response(res,"Error System",null,500)
        }
    },
    getTransactionsUser :async(req,res)=>{
        try {
            const {id,page,page_limit} = req.query
            const data = await userManagementServices.getTransactionsUser(id,page,page_limit)
            return Response(res,"Success",data,200)
        } catch (error) {
            console.log(error)
            Response(res,"Error System",null,500)
        }
    },
    //user
    getUser: catchError(async (req,res)=>{
        const email = req.query.email
        const data = await userServices.getUserByEmail(email);
        return Response(res,"Success",data,200)
    })
}