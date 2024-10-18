const { Transaction } = require("../../models/transaction.model");
const { Partner } = require("../../models/partner.model");
const { getTransactions } = require("../../repositories/transaction.repo");
const { unSelectData } = require("../../utils");
const convertToObjectId = require("../../utils/convertTypeObject");
const getPartners = async (option) => {
  const [data, pageCount] = await Promise.all([
    await Partner.find(option.filter)
      .select(option.select)
      .limit(option.page_limit)
      .skip((option.page - 1) * option.page_limit)
      .sort({ createdAt: option.sort }),
    Math.ceil(
      (await Partner.countDocuments(option.filter)) / option.page_limit
    ),
  ]);
  return { data, pageCount };
};
const getPartnerDetails = async (id) => {
  const partnerID = convertToObjectId(id);
  return await Partner.findById(partnerID).select(
    unSelectData(["password", "privateKey", "publicKey"])
  );
};
const getPartnerTransactions = async (option) => {
  const [data, pageCount] = await Promise.all([
    await getTransactions(option),
    Math.ceil(
      (await Transaction.countDocuments(option.filter)) / option.page_limit
    ),
  ]);
  return { data, pageCount };
};
const banPartner = async (id) => {
  const result = await Partner.findByIdAndUpdate(
    convertToObjectId(id),
    [{ $set: { inactive: { $eq: [false, "$inactive"] } } }],
    { new: true }
  ).select("inactive");
  if (result.modifiedCount === 0) {
    throw new AppError("Fail, try again", 404);
  }
  return result;
};
module.exports = {
  getPartners,
  getPartnerDetails,
  getPartnerTransactions,
  banPartner,
};
