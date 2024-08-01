const {Voucher} = require('../models/voucher.model')
const applyVoucher= (type, amount, discountValue, quantity) => {
    let result;
    if(quantity <= 0){
        return false
    }
    if (type === "discount_amount") {
        result = amount - discountValue;
        console.log(result)
        if(result < 0){
            result = 0
    
            return result;
        }
    } else if (type === "discount_percent") {
        result = amount - (amount * (discountValue / 100));
    } else {
        return false;
    }
    return isNaN(result) ? false : result;
}
const updateQuantityVoucher = async(id,session)=>{
    try {
        const data = Voucher.updateOne({_id:id},{$inc:{quantity:-1,usedCount:1}},{session})
        return data
    } catch (error) {
        console.log(error)
        throw error
    }
}
module.exports ={
    getVoucherByCode:async(code)=>{
        try {
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
    applyVoucher,
    updateQuantityVoucher,
    applyVoucherPayment:async(transactionDataTemp,session,voucher_code)=>{
        try {
            const getVoucher = await Voucher.findOne({code:voucher_code})
            if(getVoucher !== false || getVoucher.quantity > 0){
                const result_apply = applyVoucher(getVoucher.type, transactionDataTemp.amount, getVoucher.discountValue, getVoucher.quantity);
                console.log(result_apply)
                if (result_apply === false) {
                    await session.abortTransaction();
                    const data = {
                        message:"Số lượng voucher đã hết vui lòng thử lại!",
                        status:false
                    }
                    return data
                }
                const resultUpdateVoucher = await updateQuantityVoucher(getVoucher._id,session)
                if(resultUpdateVoucher.modifiedCount === 0){
                    await session.abortTransaction();
                    return Response(res, "Voucher đã hết vui lòng thử lại", null, 500);
                }
                const data ={
                    status: true,
                    voucherID:getVoucher._id,
                    amount:result_apply
                }
                return data
            }else{
                const data = {
                    message:"Voucher không tồn tại",
                    status:false
                }
                return data
            }
        } catch (error) {
            console.log(error)
            const data = {
                message:"Số lượng voucher đã hết vui lòng thử lại!",
                status:false
            }
            return data
        }
    },
    
    addVoucher:async(body)=>{
        try {
            const data = await Voucher.create(body)
            return data
        } catch (error) {
            console.log(error)
            throw error
        }
    },
    editVoucher: async(voucherID,body)=>{
        try {
            const data = await Voucher.findByIdAndUpdate(voucherID,body)
            return data
        } catch (error) {
            console.log(error)
            throw error
        }
    },
    deleteVoucher: async(voucherID)=>{
        try {
            const data = await Voucher.findByIdAndDelete(voucherID)
            return data
        } catch (error) {
            console.log(error)
            throw error
        }
    },
    getDetailsVoucher:async(voucherID)=>{
        try {
            const data = await Voucher.findById(voucherID)
            return data
        } catch (error) {
            console.log(error)
            throw error
        }   
    }
}