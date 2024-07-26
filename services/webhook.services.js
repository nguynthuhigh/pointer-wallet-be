const {Partner} = require('../models/partner.model')
module.exports = {
    addWebhookEndpoint:async(endpoint,partnerID)=>{
        try {
            const data = Partner.findByIdAndUpdate(partnerID,{webhook:endpoint})
            return data
        } catch (error) {
            console.log(error)
            throw error
        }
    },
    checkWebhook:async(partnerID)=>{
        try {
            const partner = await Partner.findById(partnerID);
            if(partner.webhook === undefined){
                return false
            }
            return true
        } catch (error) {
            console.log(error);
            throw error
        }
    },
    deleteWebhook: async(partnerID)=>{
        try {
            const data = Partner.findByIdAndUpdate(partnerID,{$unset: {webhook:''}})
            return data
        } catch (error) {
            console.log(error)
            throw error
        }
    },
}