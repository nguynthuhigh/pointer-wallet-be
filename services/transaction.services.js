const {Transaction} = require('../models/transaction.model')
const {Transaction_Temp} = require('../models/temp_transaction.model')
const {getRedisClient} = require('../configs/redis/redis')
const moment = require('../utils/moment')
const AppError = require('../helpers/handleError')
const redis = require('../helpers/redis.helpers')
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
        const data = await Transaction.findByIdAndUpdate({_id:transactionID},
            {status:status},
            {new: true},
            {session})
        return data
    },
    getTransactionForPayment:async(transactionID)=>{
        const redis = getRedisClient()
        const transactionData = await redis.hgetall(`transaction:${transactionID}`)
        if (Object.keys(transactionData).length === 0) {
            const data = await Transaction.findById(transactionID)
                .populate('currency sender receiver partnerID')
                .exec()
            const timeLimit = moment.limitTime(data.createdAt)
            await redis.hset(`transaction:${transactionID}`,{data:JSON.stringify(data)});
            await redis.expire(`transaction:${transactionID}`, timeLimit);
            return data
        }
        if (transactionData) {
            const data = JSON.parse(transactionData.data)
            return data
        }
    },
    getTransactionById:async(transactionID)=>{
        const data = await Transaction.findById(transactionID).populate('currency sender receiver partnerID').exec() 
        if(data.status === 'completed'){
            throw new AppError("Giao dịch abc",400) 
        }
        return data
    },
    findTransactionAndUpadte:async(transactionID,sender,session)=>{
        // const data = await Transaction_Temp.findByIdAndUpdate(transactionID,{sender:sender,completedAt: new Date()},{session,new:true})
        const data = await Transaction_Temp.findById(transactionID)
        return data
    },
    getTransactionsPartner: async (partnerID, page, pagesize) => {
        const data = await Transaction.find({ partnerID: partnerID })
            .sort({ createdAt: -1 })
            .skip((page - 1) * pagesize)
            .limit(pagesize);
        return data;
    },
    countTransactionsPartner:async(partnerID)=>{
        const data = await Transaction.countDocuments({ partnerID: partnerID })
        return data;
    },
    getTransactionRefund:async(partnerID,orderID)=>{
        const data = await Transaction.findOne({partnerID:partnerID, orderID:orderID}).sort({ createdAt: -1 })
        if(!data){
            throw new AppError("Không tìm thấy giao dịch",400)
        }
        return data
    },
    updateTransactionRefund:async(transactionData,session)=>{
        const updateTransactionResult = await Transaction.updateOne(transactionData._id,{status:"refunded"},{session})
        if(updateTransactionResult.modifiedCount === 0){
            await session.abortTransaction();
            throw new AppError("Lỗi giao dịch vui lòng thử lại",400)
        }
    },
    updateCompletedPayment:async(amount,voucherID,sender,transactionID,session)=>{
        const data = await Transaction.updateOne({_id:transactionID}, {
            status: 'completed',
            amount: amount,
            voucherID: voucherID,
            sender:sender
        }, { new: true, session});
        if(data.modifiedCount === 0){
            throw new AppError("Error system",500)
        }
        redis.del(`transaction:${transactionID}`)
        return {
            ...data,
            _id:transactionID
        }
    }
    
    
}