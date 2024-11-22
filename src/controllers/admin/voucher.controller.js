const { VoucherService } = require("../../services/admin/voucher.services");
const {
  getRange,
  toBoolean,
  sortBy,
} = require("../../helpers/mongoose.helpers");
const { cleanData } = require("../../utils");
const { Response } = require("../../utils/response");
const catchError = require("../../middlewares/catchError.middleware");
module.exports = {
  getVouchers: catchError(async (req, res) => {
    const {
      page = 1,
      page_limit = 10,
      isPublic,
      sort = "desc",
      start,
      end,
      type,
      search
    } = req.query;
    const filter = {
      isPublic: toBoolean(isPublic),
      createdAt: getRange(start, end),
      type,
    };
    const data = await VoucherService.getVouchers({
      page,
      page_limit,
      filter: cleanData(filter),
      sort: sortBy(sort),
      search
    });
    return Response(res, "Success", data, 200);
  }),
  getVoucherDetails: catchError(async (req, res) => {
    const data = await VoucherService.getVoucherDetails(req.params.id);
    return Response(res, "Success", data, 200);
  }),
};
