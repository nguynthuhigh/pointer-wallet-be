const {Transaction} = require('../models/transaction.model')
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
        try {
            const data = await Transaction.findById(transactionID).populate('currency sender receiver').exec()
            return data
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    
}