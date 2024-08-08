const {Transaction} = require('../models/transaction.model')
const {Transaction_Temp} = require('../models/temp_transaction.model')
const {getRedisClient} = require('../configs/redis/redis')
const moment = require('../utils/moment')
module.exports ={
    createTransaction:async(type,amount,message,currency,sender,receiver,partnerID)=>{
        await Transaction.create({
            type:type,
            amount:amount,
            message:message,
            currency:currency,
            sender:sender,
            receiver:receiver,
            partnerID: partnerID
        }).then(data=>{
            return data
        }).catch(error=>{
            console.log(error) 
        })
    },
    updateStatusTransaction:async(transactionID,status,session)=>{
        try {
            const data = await Transaction.findByIdAndUpdate({_id:transactionID},
                {status:status},
                {new: true},
                {session})
            return data
        } catch (error) {
            throw error
        }

    },
    getTransaction:async(transactionID)=>{
        const redis = getRedisClient()
        try {
            const transactionData = await redis.hgetall(`transaction:${transactionID}`)
            if (Object.keys(transactionData).length === 0) {
                const data = await Transaction.findById(transactionID).populate('currency sender receiver partnerID').exec()
                const timeLimit = moment.limitTime(data.createdAt)
                await redis.hset(`transaction:${transactionID}`,{data:JSON.stringify(data)});
                await redis.expire(`transaction:${transactionID}`, timeLimit);
                return data
            }
            if (transactionData) {
                const data = JSON.parse(transactionData.data)
                return data
              }
        } catch (error) {
            console.log(error)
        }
    },
    findTransactionAndUpadte:async(transactionID,sender,session)=>{
        try {
            // const data = await Transaction_Temp.findByIdAndUpdate(transactionID,{sender:sender,completedAt: new Date()},{session,new:true})
            const data = await Transaction_Temp.findById(transactionID)
            return data
        } catch (error) {
            console.log(error)
        }
    },
    getTransactionsPartner: async (partnerID, page, pagesize) => {
        try {
            const data = await Transaction.find({ partnerID: partnerID })
                .sort({ createdAt: -1 })
                .skip((page - 1) * pagesize)
                .limit(pagesize);
            return data;
        } catch (error) {
            console.log(error);
        }
    },
    countTransactionsPartner:async(partnerID)=>{
        try {
            const data = await Transaction.countDocuments({ partnerID: partnerID })
            return data;
        } catch (error) {
            console.log(error);
        }
    },
    getTransactionRefund:async(partnerID,orderID)=>{
        try{
            const data = await Transaction.findOne({partnerID:partnerID, orderID:orderID}).sort({ createdAt: -1 })
            return data
        }
        catch (error){
            console.log(data)
            throw err
        }
    }
    
}