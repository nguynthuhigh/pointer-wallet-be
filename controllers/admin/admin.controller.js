const adminServices = require('../../services/admin/admin.services')
const bcrypt = require('../../utils/bcrypt')
const {Response} = require('../../utils/response')
const tokenServices = require('../../services/token.services')
const {LoginHistory} = require('../../models/admin/login_history.model')
const catchError = require('../../middlewares/catchError.middleware')
const AppError = require('../../helpers/handleError')
module.exports = {
    //[POST] /api/v1/admin/add-admin
    createAccount: catchError(async(req,res)=>{
        const {email,password,role} = req.body
        const admin = await adminServices.findAdmin(email)
        if(admin){
            throw new AppError("Email already exists",400)
        }
        const passwordHash = bcrypt.bcryptHash(password)
        await adminServices.createAdmin(email,passwordHash,role)
        Response(res,"New member successfully added",email,200)
    }),
    //[POST] /api/v1/admin/sign-in
    signIn: catchError(async(req,res)=>{
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
    }),
    //[GET] /api/v1/admin/get-all-admins
    getAllAdmins: catchError(async(req,res)=>{
        const data = await adminServices.getAllAdmins()
        return Response(res,"Success",data,200)
    }),
    //[PATCH] /api/v1/admin/ban-admin
    banAdmin: catchError(async(req,res)=>{
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
    })
}