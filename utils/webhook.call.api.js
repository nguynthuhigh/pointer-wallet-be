const axios = require('axios')
module.exports = {
    postWebhook:async(endpoint,body)=>{
        try {
            const res = await axios.post(endpoint,body)
            return res 
        } catch (error) {
            return error
        }
    }
}