const {Partner} = require('../../models/partner.model')
const {Transaction} = require('../../models/transaction.model')
const getPartners =async (page,page_limit)=>{
    try {
        return await Partner.find()
                    .select('email image description createdAt inactive')
                    .limit(page_limit)
                    .skip((page-1)*page_limit)
                    .sort({ createdAt: -1 })
    } catch (error) {
        console.log(error)
        throw(error)
    }
}
const getDetailsPartner =async (partnerID)=>{
    try {
        return await Partner.findById(partnerID).select('email image description createdAt inactive')
    } catch (error) {
        console.log(error)
        throw(error)
    }
}
const getTransactionsPartner= async (partnerID, page, pagesize) => {
    try {
        const data = await Transaction.find({ partnerID: partnerID })
            .sort({ createdAt: -1 })
            .skip((page - 1) * pagesize)
            .limit(pagesize);
        return data;
    } catch (error) {
        console.log(error);
    }
}
const func = {
    getPartners,
    getDetailsPartner,
    getTransactionsPartner
}
module.exports = func