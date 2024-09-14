const {User} = require('../../models/user.model')
const {Transaction} = require('../../models/transaction.model')
const AppError = require('../../helpers/handleError')
const getUsers =async (sort,page,page_limit,filter,select)=>{
    const [data, count] = await Promise.all([
        await User.find(filter)
        .select(select)
        .limit(page_limit)
        .skip((page-1)*page_limit)
        .sort({ createdAt: sort })
        .lean(),
        Math.ceil(await User.countDocuments(filter)/page_limit)
    ])
    return {
        data:data,
        pageCount: count
    }
}

const getUserTransactions = async (userID, page, page_limit, filter, sort) => {
    const query = { $or: [{ receiver: userID }, { sender: userID }], $and: filter };
    const [transactions, count] = await Promise.all([
      Transaction.find(query)
        .populate({ path: 'currency', select: '_id symbol name' })
        .sort({ createdAt: sort })
        .skip((page - 1) * page_limit)
        .limit(page_limit)
        .lean()
        .exec(),
      Transaction.countDocuments(query)
    ]);
    return {
      transaction: transactions,
      pageCount: Math.ceil(count / page_limit)
    };
  };
  
const getUserDetails = async (id,select)=>{
    return await User.findById(id).select(select)
}
const banUser = async(userID)=>{
    const result =  await User.findByIdAndUpdate(userID,[{$set:{inactive:{$eq:[false,"$inactive"]}}}],{new:true}).select('inactive')
      if(result.modifiedCount === 0){
            throw new AppError('Fail, try again',404)
        }
    return result
}
const func = {
    getUsers,
    getUserTransactions,
    getUserDetails,
    banUser
}
module.exports = func