const { Wallet,Currency } = require('../models/wallet.model');
const { ethers } = require('ethers');

module.exports = {
  createWallet: (userID,partnerID) => {
    return new Promise(async(resolve, reject) => {
        const EVMwallet = ethers.Wallet.createRandom();
        const getCurrency = await Currency.find();
        const currencies = []
        getCurrency.forEach(getCurrency=>{
            currencies.push({currency:getCurrency._id,balance:0})
        })
        Wallet.create({
            address: EVMwallet.address,
            mnemonic: EVMwallet.mnemonic.phrase,
            userID: userID,
            partnerID:partnerID,
            currencies: currencies
        }).then(() => {
            resolve(true);
        }).catch((err) => {
            reject(err);
        });
    });
  },
  getCurrency:async(currency)=>{
    try {
        const getCurrency = await Currency.findOne({symbol:currency});
        if (!getCurrency){
            return undefined
        }
        return getCurrency
    } catch (error) {
        console.error(error)
    }
  },
  checkBalance:async(userID,currencyID,amount)=>{
    try {
        const user_wallet =await Wallet.findOne({userID:userID})
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
  updateBalance:async(userID,currencyID,amount,session)=>{
    try {
        await Wallet.findOneAndUpdate(
            {userID:userID,'currencies.currency':currencyID},
            {$inc : {'currencies.$.balance':-amount}},
            {session}).then(data=>{return data}).catch(error=>{
                console.log(error);
                throw error;
            })
    } catch (error) {
        console.log(error);
        throw error; 
    }
  }
};
