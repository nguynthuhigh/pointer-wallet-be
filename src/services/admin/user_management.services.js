const { User } = require("../../models/user.model");
const AppError = require("../../helpers/handleError");
const mongoose = require('mongoose')
const {
  getTransactionsV2,
  countTransactions,
} = require("../../repositories/transaction.repo");
const getUsers = async (sort, page, page_limit, filter, select, search) => {
  if (search) {
    filter.$or = [];
    if (mongoose.Types.ObjectId.isValid(search)) {
      filter.$or.push({_id:search})
    }
    filter.$or.push({full_name: {$regex:search,$options: "i"}})
    filter.$or.push({email: {$regex:search,$options: "i"}})
  }
  const [data, count] = await Promise.all([
    await User.find(filter)
      .select(select)
      .limit(page_limit)
      .skip((page - 1) * page_limit)
      .sort({ createdAt: sort })
      .lean(),
    Math.ceil((await User.countDocuments(filter)) / page_limit),
  ]);
  return {
    data: data,
    pageCount: count,
  };
};

const getUserTransactions = async (option) => {
  const query = {
    $or: [{ receiver: option.userID }, { sender: option.userID }],
    $and: option.filter,
  };
  const transactions = await getTransactionsV2({ ...option, filter: query });
  const pageCount = await countTransactions(query, option.page_limit);
  return { transactions, pageCount };
};

const getUserDetails = async (id, select) => {
  return await User.findById(id).select(select);
};
const banUser = async (userID) => {
  const result = await User.findByIdAndUpdate(
    userID,
    [{ $set: { inactive: { $eq: [false, "$inactive"] } } }],
    { new: true }
  ).select("inactive");
  if (result.modifiedCount === 0) {
    throw new AppError("Fail, try again", 404);
  }
  return result;
};
const func = {
  getUsers,
  getUserTransactions,
  getUserDetails,
  banUser,
};
module.exports = func;
