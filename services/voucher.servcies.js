const {Voucher} = require('../models/voucher.model')
module.exports ={
    getVoucherByCode:async(code)=>{
        try {
            console.log(code)
            if(code){
                return await Voucher.findOne({code:code})
            }
            else{
                return false
            }
        } catch (error) {
            console.log(error)
            throw error
        }
    },
    getVouchersOfPartner:async(partnerID)=>{
        try {
            const data = await Voucher.find({partnerID:partnerID})
            return data
        } catch (error) {
            throw error
        }
    },
    applyVoucher: (type, amount, discountValue, quantity) => {
        if (quantity === 0) {
            return false;
        }
        let result;
        if (type === "discount_amount") {
            result = amount - discountValue;
        } else if (type === "discount_percent") {
            result = amount - (amount * (discountValue / 100));
        } else {
            return false;
        }
        return isNaN(result) ? false : result;
    },
    updateQuantityVoucher:async(id,session)=>{
        try {
            const data = Voucher.findByIdAndUpdate(id,{$inc:{quantity:-1,usedCount:1}},{session})
            return data
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}