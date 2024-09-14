const { Transaction } = require("../../models/transaction.model")
const repository = require('../../repositories/transaction.repo')

class TransactionServices{
    static getTransaction = async(option)=>{
        return await repository.getTransactions(option)
    }
    static getTransactionDetails = async(id)=>{
        const filter = {
            _id:id
        }
        return await repository.getTransactionDetails(filter)
    }
}

module.exports = TransactionServices