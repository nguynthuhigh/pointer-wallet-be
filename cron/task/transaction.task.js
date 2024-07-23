const { Transaction } = require("../../models/transaction.model")
module.exports ={
    deletePendingTransaction:async()=>{
        try {
            const data = await Transaction.deleteMany({$or:{status:'pending',statys:'fail'}})
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }
}