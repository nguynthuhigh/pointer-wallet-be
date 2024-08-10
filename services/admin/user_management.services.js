const {User} = require('../../models/user.model')
const {Transaction} = require('../../models/transaction.model')
const getUsers =async (page,page_limit)=>{
    try {
        return await User.find()
                    .select('email image avatar createdAt inactive')
                    .limit(page_limit)
                    .skip((page-1)*page_limit)
                    .sort({ createdAt: -1 })
    } catch (error) {
        console.log(error)
        throw(error)
    }
}
const getDetailsUser =async (userID)=>{
    try {
        return await User.findById(userID).select('email image avatar createdAt inactive')
    } catch (error) {
        console.log(error)
        throw(error)
    }
}
const getTransactionsUser= async (userID, page, pagesize) => {
    try {
        const data = await Transaction.find({sender: userID})
            .sort({ createdAt: -1 })
            .skip((page - 1) * pagesize)
            .limit(pagesize);
        return data;
    } catch (error) {
        console.log(error)
        throw error
    }
}
const banUser = async(userID)=>{
    try {
        return await User.findByIdAndUpdate(userID,[{$set:{inactive:{$eq:[false,"$inactive"]}}}],{new:true}).select('inactive')
    } catch (error) {
        console.log(error)
        throw error
    }
}
const func = {
    getUsers,
    getDetailsUser,
    getTransactionsUser,
    banUser
}
module.exports = func