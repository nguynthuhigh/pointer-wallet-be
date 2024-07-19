const {User} = require('../models/user.model')
const {Wallet} = require('../models/wallet.model')
module.exports = {
    getProfile:async(userID)=>{
        try {
            const userData = await User.findById(userID)
            const walletData = await Wallet.findOne({userID:userID})
            const data =  {userData,walletData}
            return data
        } catch (error) {
            console.log(error)
            throw(error)
        }
    },
    getUserByEmail:async(email)=>{
        try {
            const userData = await User.findOne({email:email})
            return userData
        } catch (error) {
            return null
            console.log(error)
        }
    }
}