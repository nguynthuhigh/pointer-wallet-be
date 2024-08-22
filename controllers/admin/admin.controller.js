const adminServices = require('../../services/admin/admin.services')
const bcrypt = require('../../utils/bcrypt')
const {Response} = require('../../utils/response')
const tokenServices = require('../../services/token.services')
const {LoginHistory} = require('../../models/admin/login_history.model')
const catchError = require('../../middlewares/catchError.middleware')
module.exports = {
    //[POST] /api/v1/admin/add-admin
    createAccount:async(req,res)=>{
        try {
            const {email,password,role} = req.body
            const admin = await adminServices.findAdmin(email)
            if(!admin){
                const passwordHash = bcrypt.bcryptHash(password)
                await adminServices.createAdmin(email,passwordHash,role)
                Response(res,"New member successfully added",email,200)
            }
            else{
                Response(res,"Email already exists",null,400)
            }
        } catch (error) {
            console.log(error)
            return Response(res,"System error",null,500)
        }
    },
    //[POST] /api/v1/admin/sign-in
    signIn:async(req,res)=>{
        try {
            const userIP = req.ip || req.connection.remoteAddress
            const {email,password} = req.body
            const admin = await adminServices.findAdmin(email)
            if(!admin){
                Response(res,"Invalid email or password",null,400)
            }
            if(!bcrypt.bcryptCompare(password,admin.password)){
                Response(res,"Invalid email or password",null,400)
            }
            const token = await tokenServices.createToken(admin._id)
            await LoginHistory.create({adminID:admin._id,ipAddress:userIP})
            Response(res,"Sign in successfully",token,200)
        } catch (error) {
            console.log(error)
            return Response(res,"System error",null,500)
        }
    },
    //[GET] /api/v1/admin/get-all-admins
    getAllAdmins:async(req,res)=>{
        try {
            const data = await adminServices.getAllAdmins()
            return Response(res,"Success",data,200)
        } catch (error) {
            console.log(error)
            return Response(res,"System error",null,500)
        }
    },
    //[PATCH] /api/v1/admin/ban-admin
    banAdmin:async(req,res)=>{
        try {
            const {id} = req.body
            const data = await adminServices.banAdmin(id)
            if(data.modifiedCount === 0){
                return Response(res,"Fail, try again",null,400)
            }
            if(data.active === true){
                return Response(res,"Member successfully unbanned",null,200)
            }
            else{
                return Response(res,"Member successfully banned",null,200)
            }
        } catch (error) {
            console.log(error)
            return Response(res,"System error",null,500)
        }
    }
}