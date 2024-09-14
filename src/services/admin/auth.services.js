const {Admin} = require('../../models/admin.model')
const bcrypt = require('../../utils/bcrypt')
const tokenServices = require('../../services/token.services')
const tokenUtils = require('../../utils/token')
const {LoginHistory} = require('../../models/admin/login_history.model')
const Key = require('../../models/keys.model')
const AppError = require('../../helpers/handleError')
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
    static getAllAdmins = async()=>{
        return await Admin.find().select('avatar email role');
    }
    static banAdmin = async(id)=>{
        const result = await Admin.findByIdAndUpdate(id,[{$set:{active:{$eq:[false,"$active"]}}}]).select('active')
        if(result.modifiedCount === 0){
            return Response(res,"Fail, try again",null,400)
        }
        return result
    }
    static refreshToken = async(refreshToken)=>{
        const token = await Key.findOne({refresh_token:refreshToken})
        if(!token){
            throw new AppError("Unauthorized",401)
        }
        tokenUtils.verifyToken(token)
        const newToken = tokenServices.createTokenPair(token.adminID)
        const result = await Key.findOneAndUpdate({refresh_token:refreshToken},{refresh_token:newToken.refreshToken})
        if(result.modifiedCount === 0){
            throw new AppError('Error refresh token',500)
        }
        return newToken
    }
}
module.exports = AuthAdminServices