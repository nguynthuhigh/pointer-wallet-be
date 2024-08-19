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
    const data = await Transaction.find({$or:[{receiver:userID},{sender:userID}]})
    .populate({path:'sender',select:'_id email full_name avatar '})
    .populate({path:'receiver',select:'_id email full_name avatar '})
    .populate({path:'currency',select:'_id symbol name'})
    .populate({path:'partnerID',select:'_id name image'})
    .sort({ createdAt: -1 })
    .skip((page - 1) * pagesize)
    .limit(pagesize).exec();
    return data;
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