const {Admin} = require('../../models/admin.model')
const bcrypt = require('../../utils/bcrypt')
const tokenServices = require('../../services/token.services')
const {LoginHistory} = require('../../models/admin/login_history.model')
class AuthAdminServices {
    static createAdmin = async(email,password,role)=>{
        const passwordHash = bcrypt.bcryptHash(password)
        const data = await Admin.create({email:email,password:passwordHash,role:role})
        return data
    }
    static loginAccount = async(email,password,userIP)=>{
        const admin = await Admin.findOne({email:email})
        if(!admin){
            Response(res,"Invalid email or password",null,400)
        }
        if(!bcrypt.bcryptCompare(password,admin.password)){
            Response(res,"Invalid email or password",null,400)
        }
        const token = await tokenServices.createTokenPair(admin._id)
        await LoginHistory.create({adminID:admin._id,ipAddress:userIP})
        return token
    }
}
const findAdmin = async(email)=>{
    try {
        return await Admin.findOne({email:email})
    } catch (error) {
        console.log(error)
        throw error
    }
}
const getAllAdmins = async()=>{
    try {
        return await Admin.find().select('avatar email role');
    } catch (error) {
        console.log(error)
        throw error
    }
}
const banAdmin = async(id)=>{
    try {
        return await Admin.findByIdAndUpdate(id,[{$set:{active:{$eq:[false,"$active"]}}}]).select('active')
    } catch (error) {
        console.log(error)
        throw error
    }
}
const func = {

    findAdmin,
    getAllAdmins,
    banAdmin
}
module.exports = AuthAdminServices