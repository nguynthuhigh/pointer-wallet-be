const { Transaction } = require("../../models/transaction.model");
const repository = require("../../repositories/transaction.repo");
const convertToObjectId = require("../../utils/convert-type-object");
class TransactionServices {
  static getTransaction = async (option) => {
    const [transactions, pageCount] = await Promise.all([
      repository.getTransactions(option),
      Transaction.countDocuments(option.filter).then((count) =>
        Math.ceil(count / option.page_limit)
      ),
    ]);
    return { transactions, pageCount };
  };
  static getTransactionDetails = async (id) => {
    const filter = {
      _id: convertToObjectId(id),
    };
    return await repository.getTransactionDetails(filter);
  };
}

module.exports = TransactionServices;
