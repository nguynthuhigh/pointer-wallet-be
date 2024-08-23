const { Transaction } = require("../../models/transaction.model")

class TransactionServices{
    static getTransaction = async(limit,page)=>{
        return await Transaction.find()
            .limit(limit)
            .skip((page-1)*limit)
            .sort({createdAt:-1})
            .lean()
    }
}

module.exports = TransactionServices