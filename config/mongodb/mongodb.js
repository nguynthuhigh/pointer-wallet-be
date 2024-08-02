
const mongoose = require("mongoose");

module.exports ={
    connectMongoDB:async()=>{
        try {
            await mongoose.connect(process.env.MONGODB_URI)
            console.log("Connected to MongoDB")

        } catch (error) {
            console.log("Error Connecting to MongoDB:"+error)
        }
    }
}

