const {Transaction} = require('../models/transaction.model')
const {Transaction_Temp} = require('../models/temp_transaction.model')
const {getRedisClient} = require('../configs/redis/redis')
const moment = require('../utils/moment')
const AppError = require('../helpers/handleError')
const redis = require('../helpers/redis.helpers')
const mongoose = require('mongoose')
const walletServices = require('../services/wallet.services')
class TransactionFactory{
    static async createTransaction(type,body){
        switch (type) {
            case 'payment':
                return new Transaction_Payment(body).createTransactionPayment()
            case 'transfer':
                return new Transaction_Transfer(body).createTransactionTransfer()
            case 'deposit':
                return new TransactionDeposit(body).createTransactionDeposit()
            case 'withdraw':
                return new TransactionDeposit(body).createTransactionDeposit()
            case 'refund':
                return new TransactionRefund(body).createTransactionRefund()
            default:
                throw new AppError('Invalid type',402)
        }
    }
}
class Transactions {
    constructor({
        type,amount,title,message,status,currency,
    }){
        this.type = type,
        this.amount = amount,
        this.title = title,
        this.message = message,
        this.currency = currency
    }
}
class Transaction_Transfer extends Transactions{
    constructor({ sender, receiver, ...options }){
        super(options)
        this.sender = sender,
        this.receiver = receiver,
        this.status = 'completed'
    }
    async createTransactionTransfer(){
        const session = await mongoose.startSession();
        session.startTransaction();
        const data = new Transaction(this)
        if(!data){
            throw new AppError('Error Create Transactions',500)
        }
        const transactionResult = await data.save({ session });
        await walletServices.updateBalance(this.sender, this.currency, -this.amount, session);
        await walletServices.updateBalance(this.receiver, this.currency, this.amount, session);
        await session.commitTransaction(); 
        await session.endSession();
        return transactionResult
    }
}
class Transaction_Payment extends Transactions{
    constructor({partnerID,userID,return_url,orderID,...options}){
        super(options)
        this.partnerID = partnerID,
        this.userID = userID,
        this.return_url = return_url,
        this.orderID = orderID,
        this.status ='pending'
    }
    async createTransactionPayment(){
        const data = await Transaction.create(this)
        if(!data){
            throw new AppError('Error Create Transactions',500)
        }
        return data
    }
}
class TransactionDeposit extends Transactions{
    constructor({sender,creditcard,...options}){
        super(options)
        this.creditcard = creditcard,
        this.sender = sender,
        this.status ='completed'
    }
    async createTransactionDeposit(){
        const session = await mongoose.startSession();
        session.startTransaction();
        const data = new Transaction(this)
        const transactionResult = await data.save({ session });
        if(!transactionResult){
            throw new AppError('Error Create Transactions',500)
        }
        await walletServices.updateBalance(this.sender, this.currency, -this.amount, session);
        await session.commitTransaction(); 
        await session.endSession();
        return transactionResult
    }
}
class TransactionRefund extends Transactions{
    constructor({sender,partnerID,...options}){
        super(options)
        this.sender = sender,
        this.partnerID = partnerID
    }
    async createTransactionRefund(){
        const data = await Transaction.create(this)
        if(!data){
            throw new AppError('Error Create Transactions',500)
        }
        return data
    }
}
module.exports ={
    TransactionFactory,
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
            throw new AppError("Giao dịch hết hạn",400) 
        }
        return data
    },
    findTransactionAndUpadte:async(transactionID,sender,session)=>{
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
    },
    getTransactionDetails:async(transactionID,userID)=>{
        const data =  await Transaction.findOne({
            $or:[{_id:transactionID,sender:userID},{_id:transactionID,receiver:userID}]
        }).populate('creditcard sender receiver currency').lean()
        .exec()
        if(!data){
            throw new AppError("Không tìm thấy giao dịch",404)
        }
        return data
    }
}