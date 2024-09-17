const { Transaction } = require("../models/transaction.model")

module.exports = {
    getTransactions: async (option)=>{
        return await Transaction.find(option.filter)
        .populate({ path: 'currency', select: '_id symbol name' })
        .sort({ createdAt: option.sort })
        .skip((option.page - 1) * option.page_limit)
        .limit(option.page_limit)
        .lean()
        .exec()
    },
    getTransactionsV2: async (option)=>{
        return await Transaction.find(option.filter)
        .populate({path:'sender',select:'_id email full_name avatar '})
        .populate({path:'receiver',select:'_id email full_name avatar '})
        .populate({path:'currency',select:'_id symbol name'})
        .populate({path:'partnerID',select:'_id name image'})
        .sort({ createdAt: option.sort })
        .skip((option.page - 1) * option.page_limit)
        .limit(option.page_limit)
        .lean()
        .exec()
    },
    getTransactionDetails: async(filter)=>{
        return await Transaction.findOne(filter)
        .populate({path:'sender',select:'_id email full_name avatar '})
        .populate({path:'receiver',select:'_id email full_name avatar '})
        .populate({path:'currency',select:'_id symbol name'})
        .populate({path:'partnerID',select:'_id name image'})
        .lean()
        .exec()
    },
}