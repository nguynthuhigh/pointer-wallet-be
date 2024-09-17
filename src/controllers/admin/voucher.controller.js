const { VoucherService } = require("../../services/admin/voucher.services");
const { getRange, toBoolean,sortBy } = require('../../helpers/mongoose.helpers')
const {cleanData } = require('../../utils')
module.exports = {
    getVouchers: async(req,res)=>{
        const { page = 1, page_limit = 10, isPublic, sort = 'desc', start, end, type } = req.query;
        const filter = {
            isPublic: toBoolean(isPublic),
            createdAt: getRange(start,end),
            type
        }
        const data = await VoucherService.getVouchers({
            page,
            page_limit,
            filter:cleanData(filter),
            sort:sortBy(sort)
        })
        return Response(res,"Success",data,200)
    }
}