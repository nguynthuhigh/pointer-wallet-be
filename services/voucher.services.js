const AppError = require('../helpers/handleError');
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
        throw new AppError("Không thể áp dụng voucher vui lòng thử lại",500)
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
const applyVoucherPayment=async(transactionDataTemp,session,voucher_code)=>{
    console.log(voucher_code)
    if(!voucher_code){
        return
    }
    const getVoucher = await Voucher.findOne({code:voucher_code})
    if(!getVoucher && getVoucher.quantity <= 0){
        throw new AppError("Voucher đã hết",400)
    }
    const result_apply = applyVoucher(getVoucher.type, transactionDataTemp.amount, getVoucher.discountValue, getVoucher.quantity);
    console.log(result_apply)
    if (result_apply === false) {
        throw new AppError("Không thể áp dụng voucher",400)
    }
    const resultUpdateVoucher = await updateQuantityVoucher(getVoucher._id,session)
    if(resultUpdateVoucher.modifiedCount === 0){
        throw new AppError("Voucher đã hết vui lòng thử lại",400)
    }
    const data ={
        voucherID:getVoucher._id,
        amount:result_apply
    }
    return data
}
module.exports ={
    getVoucherByCode:async(code)=>{
        const data = await Voucher.findOne({code:code})
        if(!data){
            throw new AppError("Voucher không tồn tại",404)
        }
        return data
    },
    checkOwnVoucher:async(partnerID,voucher_PartnerID)=>{
        if(partnerID.toString() !== voucher_PartnerID.toString()){
            throw new AppError("Voucher không hợp lệ với giao dịch này",400)
        }
    },
    getVouchersOfPartner:async(partnerID)=>{
        const data = await Voucher.find({partnerID:partnerID})
        if(!data){
            throw new AppError("Partner has no voucher",400);
        }
        return data
    },
    applyVoucher,
    updateQuantityVoucher,
    applyVoucherPayment,
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