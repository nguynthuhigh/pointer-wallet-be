const {User} = require('../models/user.model')
const {Wallet} = require('../models/wallet.model')
module.exports = {
    getProfile:async(userID)=>{
        try {
            return await Wallet.findOne({userID:userID})
        } catch (error) {
            console.log(error)
            throw(error)
        }
    },
    getUserById:async(id)=>{
        try {
            const userData = await User.findById(id)
            return userData
        } catch (error) {
            console.log(error)
            return null
        }
    },
    getUserByEmail:async(email)=>{
        try {
            const userData = await User.findOne({email:email})
            return userData
        } catch (error) {
            console.log(error)
            return null
        }
    }
}