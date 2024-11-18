const { Response } = require("../../utils/response");
const partnerManagementServices = require("../../services/admin/partner_management.services");
const catchError = require("../../middlewares/catchError.middleware");
const { unSelectData, cleanData } = require("../../utils");
const convertToObjectId = require("../../utils/convertTypeObject");
const {
  getRange,
  toBoolean,
  sortBy,
} = require("../../helpers/mongoose.helpers");
module.exports = {
  getPartners: catchError(async (req, res) => {
    const {
      page = 1,
      page_limit = 10,
      active = "all",
      sort = "desc",
      start,
      end,
      search
    } = req.query;
    const filter = {
      inactive: toBoolean(active),
      createdAt: getRange(start, end),
    };
    const data = await partnerManagementServices.getPartners({
      page,
      page_limit,
      select: unSelectData(["password", "privateKey", "publicKey"]),
      filter: cleanData(filter),
      sort: sortBy(sort),
      search
    });
    Response(res, "Success", data, 200);
  }),
  getPartnerDetails: catchError(async (req, res) => {
    const { id } = req.query;
    const data = await partnerManagementServices.getPartnerDetails(id);
    Response(res, "Success", data, 200);
  }),
  getPartnerTransactions: catchError(async (req, res) => {
    const {
      id,
      page = 1,
      page_limit = 10,
      sort = "desc",
      type = "all",
      status = "all",
      start,
      end,
    } = req.query;
    const filter = {
      partnerID: convertToObjectId(id),
      type,
      status,
      createdAt: getRange(start, end),
    };
    const data = await partnerManagementServices.getPartnerTransactions({
      id,
      page,
      page_limit,
      filter: cleanData(filter),
      sort: sortBy(sort),
    });
    Response(res, "Success", data, 200);
  }),
  getPartnerVouchers: catchError(() => {}),
  banPartner: catchError(async (req, res) => {
    const { id } = req.body;
    const data = await partnerManagementServices.banPartner(id);
    if (data.inactive === true) {
      return Response(res, "User successfully banned", null, 200);
    } else {
      return Response(res, "User successfully unbanned", null, 200);
    }
  }),
};
