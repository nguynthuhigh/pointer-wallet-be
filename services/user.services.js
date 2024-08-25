const AppError = require('../helpers/handleError')
const {User} = require('../models/user.model')
const {Wallet} = require('../models/wallet.model')
const bcrypt = require('../utils/bcrypt')
module.exports = {
    getProfile:async(userID)=>{
        try {
            return await Wallet.findOne({userID:userID})
        } catch (error) {
            console.log(error)
            throw error
        }
    },
    getUserById:async(id)=>{
        console.log(id)
        const userData = await User.findById(id)
        if(!userData) {
            throw new AppError('User not found',404)
        }
        return userData
    },
    getUserByEmail:async(email)=>{
        const userData = await User.findOne({email:email})
        if(!userData) {
            throw new AppError('User not found',404)
        }
        return userData
    },
    resetPasswordUser: async(email,password)=>{
        const hashPassword = bcrypt.bcryptHash(password)
        return await User.updateOne({email:email},{password:hashPassword})
    },
    existsUserByEmail:async(email)=>{
        const userData = await User.findOne({email:email})
        if(userData) {
            throw new AppError('Tài khoản đã tồn tại',404)
        }
        return userData
    },
    createUser:async(email,password)=>{
        const user = await User.create({email:email,password:password})
        if(!user){
            throw new AppError('Lỗi tạo tài khoản',400)
        }
        return user
    }
}