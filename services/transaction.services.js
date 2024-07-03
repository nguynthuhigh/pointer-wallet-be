const {Transaction} = require('../models/transaction.model')
module.exports ={
    createTransaction:(type,amount,message,currency,sender,receiver)=>{
        Transaction.create({
            type:'transfer',
            amount:amount,
            message:message,
            currency:currency,
            sender:sender,
            receiver:receiver
        }).then(data=>{
            return data
        }).catch(error=>{
            return error
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
        try {
            const data = await Transaction.findById(transactionID).populate('currency').exec()
            return data
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    
}