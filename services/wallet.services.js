const { Wallet,Currency } = require('../models/wallet.model');
const { ethers } = require('ethers');
const {User} = require('../models/user.model')
const {getRedisClient} = require('../configs/redis/redis')
const redis = require('../helpers/redis.helpers');
const AppError = require('../helpers/handleError');
module.exports = {
    createWallet: (id,type) => {
        return new Promise(async(resolve, reject) => {
            const EVMwallet = ethers.Wallet.createRandom();
            const getCurrency = await Currency.find();
            const currencies = []
            getCurrency.forEach(getCurrency=>{
                currencies.push({currency:getCurrency._id,balance:0})
            })
            if(type === 'user'){
                await Wallet.create({
                    address: EVMwallet.address,
                    mnemonic: EVMwallet.mnemonic.phrase,
                    userID: id,
                    currencies: currencies
                }).then(() => {
                    resolve(true);
                }).catch((err) => {
                    reject(err);
                });
            }
            else if(type === 'partner'){
                await Wallet.create({
                    address: EVMwallet.address,
                    mnemonic: EVMwallet.mnemonic.phrase,
                    partnerID: id,
                    currencies: currencies
                }).then(() => {
                    resolve(true);
                }).catch((err) => {
                    reject(err);
                });
            }
            else{
                reject("Invalid")
            }
        });
    },
    getCurrency:async(currency)=>{
        const getCurrency = await Currency.findOne({symbol:currency});
        if (!getCurrency){
            throw new AppError('Invalid currency',402)
        }
        return getCurrency
    },
    hasSufficientBalance:async(userID,currencyID,amount)=>{
        const user_wallet =await Wallet.findOne({userID:userID})
        const currencyBalance = user_wallet.currencies.find(item => item.currency.equals(currencyID))
        if(!currencyBalance.balance >= amount){
            throw new AppError("Số dư không đủ",402)
        }
    },
    checkBalancePartner:async(partnerID,currencyID,amount)=>{
    try {
        const user_wallet =await Wallet.findOne({partnerID:partnerID})
        const currencyBalance = user_wallet.currencies.find(item => item.currency.equals(currencyID))
        if(currencyBalance.balance >= amount){
            return true
        }else{
            return false
        }
    } catch (error) {
        console.error(error)
    }
    },
        getBalance:(userID,currency)=>{

    },
    updateBalance: async (userID, currencyID, amount, session) => {
        const redis = getRedisClient()
        const rs = await redis.del(`user:${userID}`)
        const result = await Wallet.updateOne(
            { userID: userID, 'currencies.currency': currencyID },
            { $inc: { 'currencies.$.balance': parseInt(amount) } },
            { session} 
        )
        console.log(userID)
        console.log(result)
        if(result.modifiedCount === 0){
            session.abortTransaction()
            throw new AppError("Error system try again",500)
        }
    
    },
    updateBalancePartner:async(partnerID,currencyID,amount,session)=>{
        try {
            const redis = getRedisClient()
            await redis.del(`partner:${partnerID._id}`)
            const result = await Wallet.updateOne(
                { partnerID: partnerID._id, 'currencies.currency': currencyID },
                { $inc: { 'currencies.$.balance': parseInt(amount) } },
                { session, new: true } 
            );
            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    getPartnerWallet: async(partnerID)=>{
        try {
            return await Wallet.findOne({ partnerID:partnerID },'currencies')
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
};
