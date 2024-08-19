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
        const userData = await User.findById(id)
        if(!userData) {
            throw new AppError('User not found',404)
        }
        return userData
    },
    getUserByEmail:async(email)=>{
        try {
            const userData = await User.findOne({email:email})
            return userData
        } catch (error) {
            console.log(error)
            throw error
        }
    },
    resetPasswordUser: async(email,password)=>{
        const hashPassword = bcrypt.bcryptHash(password)
        try {
            return await User.updateOne({email:email},{password:hashPassword})
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}