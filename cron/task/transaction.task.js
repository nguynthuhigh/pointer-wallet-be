const { Transaction } = require("../../models/transaction.model")
module.exports ={
    deletePendingTransaction:async()=>{
        try {
            const data = await Transaction.deleteMany({status:'pending'})
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }
}