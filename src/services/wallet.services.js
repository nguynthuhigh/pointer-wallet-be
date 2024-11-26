const { Wallet, Currency } = require("../models/wallet.model");
const { ethers } = require("ethers");
const { getRedisClient } = require("../configs/redis/redis");
const AppError = require("../helpers/handleError");
module.exports = {
  createWallet: async (id, type) => {
    const EVMWallet = ethers.Wallet.createRandom();
    const getCurrency = await Currency.find();
    const currencies = [];
    getCurrency.forEach((getCurrency) => {
      currencies.push({ currency: getCurrency._id, balance: 0 });
    });
    switch (type) {
      case "user": {
        const data = await Wallet.create({
          address: EVMWallet.address,
          mnemonic: EVMWallet.mnemonic.phrase,
          userID: id,
          currencies: currencies,
        });
        if (!data) {
          throw new AppError("Đăng ký thất bại vui lòng thử lại", 400);
        }
        break;
      }
      case "partner": {
        const data = await Wallet.create({
          address: EVMWallet.address,
          mnemonic: EVMWallet.mnemonic.phrase,
          partnerID: id,
          currencies: currencies,
        });
        if (!data) {
          throw new AppError("Error Register", 400);
        }
        break;
      }
      default:
        return;
    }
  },
  getCurrency: async (currency) => {
    const getCurrency = await Currency.findOne({ symbol: currency });
    if (!getCurrency) {
      throw new AppError("Invalid currency", 402);
    }
    return getCurrency;
  },
  hasSufficientBalance: async (userID, currencyID, amount) => {
    const user_wallet = await Wallet.findOne({ userID: userID });
    const currencyBalance = user_wallet.currencies.find((item) =>
      item.currency.equals(currencyID)
    );
    if (currencyBalance.balance < amount) {
      throw new AppError("Số dư không đủ", 402);
    }
  },
  checkBalancePartner: async (partnerID, currencyID, amount) => {
    const user_wallet = await Wallet.findOne({ partnerID: partnerID });
    const currencyBalance = user_wallet.currencies.find((item) =>
      item.currency.equals(currencyID)
    );
    if (!currencyBalance.balance >= amount) {
      throw new AppError("Số dư không đủ", 402);
    }
  },
  updateBalance: async (userID, currencyID, amount, session) => {
    const redis = getRedisClient();
    await redis.del(`user:${userID}`);
    const result = await Wallet.updateOne(
      { userID: userID, "currencies.currency": currencyID },
      { $inc: { "currencies.$.balance": parseInt(amount) } },
      { session }
    );
    if (result.modifiedCount === 0) {
      session.abortTransaction();
      throw new AppError("Error system try again", 500);
    }
  },
  updateBalancePartner: async (partnerID, currencyID, amount, session) => {
    const redis = getRedisClient();
    await redis.del(`partner:${partnerID._id}`);
    const result = await Wallet.updateOne(
      { partnerID: partnerID._id, "currencies.currency": currencyID },
      { $inc: { "currencies.$.balance": parseInt(amount) } },
      { session, new: true }
    );
    if (result.modifiedCount === 0) {
      session.abortTransaction();
      throw new AppError("Error system try again", 500);
    }
  },
  getPartnerWallet: async (partnerID) => {
    return await Wallet.findOne({ partnerID: partnerID }, "currencies");
  },
};
