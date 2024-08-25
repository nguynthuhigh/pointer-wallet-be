const adminServices = require('../../services/admin/auth.services')
const bcrypt = require('../../utils/bcrypt')
const {Response} = require('../../utils/response')
const tokenServices = require('../../services/token.services')
const {LoginHistory} = require('../../models/admin/login_history.model')
const catchError = require('../../middlewares/catchError.middleware')
const AuthAdminServices = require('../../services/admin/auth.services')
module.exports = {
    //[POST] /api/v1/admin/add-admin
    createAccount: catchError(async(req,res)=>{
        const {email,password,role} = req.body
        const data = await AuthAdminServices.createAdmin(email,password,role)
        Response(res,"New member successfully added",data,200)
    }),
    //[POST] /api/v1/admin/sign-in
    signIn: catchError(async(req,res)=>{
        const userIP = req.ip || req.connection.remoteAddress
        const {email,password} = req.body
        const {accessToken,refreshToken} = await AuthAdminServices.loginAccount(email,password,userIP)
        res.cookie("refresh_token", refreshToken, {
            httpOnly:true,
            sameSite:'none',
            secure:true,
            path:'/',
            maxAge:60*60*24*15*1000
          });
        res.cookie("access_token", accessToken, {
            httpOnly:true,
            sameSite:'none',
            secure:true,
            path:'/',
            maxAge:60*60*24*15*1000
            });
        Response(res,"Sign in successfully",null,200)
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