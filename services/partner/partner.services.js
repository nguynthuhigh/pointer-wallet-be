const {Partner} = require('../../models/partner.model')

module.exports= {
    getInfo:async (partnerID)=>{
        try {
            const partner = await Partner.findById(partnerID);
            return partner
        } catch (error) {
            throw(error)
        }
    },
    updateInfo:async(partnerID,info)=>{
        try {
            const partner = await Partner.findByIdAndUpdate(partnerID,info,{new:true});
            return partner
        } catch (error) {
            throw(error)
        }
    }
}