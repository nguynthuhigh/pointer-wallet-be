const adminServices = require('../../services/admin/admin.services')
const bcrypt = require('../../utils/bcrypt')
const {Response} = require('../../utils/response')
const tokenServices = require('../../services/token.services')
module.exports = {
    createAccount:async(req,res)=>{
        try {
            const {email,password,role} = req.body
            const admin = await adminServices.findAdmin(email)
            console.log(admin)
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
    signIn:async(req,res)=>{
        try {
            const {email,password} = req.body
            const admin = await adminServices.findAdmin(email)
            if(!admin){
                Response(res,"Invalid email or password",null,400)
            }
            if(!bcrypt.bcryptCompare(password,admin.password)){
                Response(res,"Invalid email or password",null,400)
            }
            const token = await tokenServices.createToken(admin._id)
            Response(res,"Sign in successfully",token,200)
        } catch (error) {
            console.log(error)
            return Response(res,"System error",null,500)
        }
    },
    getAllAdmins:async(req,res)=>{
        try {
            const data = await adminServices.getAllAdmins()
            return Response(res,"Success",data,200)
        } catch (error) {
            console.log(error)
            return Response(res,"System error",null,500)
        }
    }
    ,
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
            return Response(res,"Member successfully banned",null,200)
        } catch (error) {
            console.log(error)
            return Response(res,"System error",null,500)
        }
    }
}