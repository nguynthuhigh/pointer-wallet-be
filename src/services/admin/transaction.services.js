const { Transaction } = require("../../models/transaction.model")
const repository = require('../../repositories/transaction.repo')
const convertToObjectId = require('../../utils/convertTypeObject')
class TransactionServices{
    static getTransaction = async(option)=>{
        return await repository.getTransactions(option)
    }
    static getTransactionDetails = async(id)=>{
        const filter = {
            _id:convertToObjectId(id)
        }
        return await repository.getTransactionDetails(filter)
    }
}

module.exports = TransactionServices