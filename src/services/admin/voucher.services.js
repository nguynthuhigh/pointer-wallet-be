const {Voucher} = require('../../models/voucher.model')
class VoucherService {
    static getVouchers = async(option)=>{
        await Voucher.find()
    }
}
module.exports ={
    VoucherService
}