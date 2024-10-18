const { Response } = require("../../utils/response");
const userServices = require("../../services/user.services");
const userManagementServices = require("../../services/admin/user_management.services");
const catchError = require("../../middlewares/catchError.middleware");
const { unSelectData, cleanData } = require("../../utils");
const {
  toBoolean,
  sortBy,
  getRange,
} = require("../../helpers/mongoose.helpers");
module.exports = {
  getUsers: catchError(async (req, res) => {
    const {
      page = 1,
      page_limit = 10,
      inactive = "all",
      sort = "desc",
      start,
      end,
    } = req.query;
    const filter = {
      inactive: toBoolean(inactive),
      createdAt: getRange(start, end),
    };
    const data = await userManagementServices.getUsers(
      sortBy(sort),
      page,
      page_limit,
      cleanData(filter),
      unSelectData(["password", "security_code"])
    );
    return Response(res, "Success", data, 200);
  }),
  banUser: catchError(async (req, res) => {
    const { id } = req.body;
    const data = await userManagementServices.banUser(id);
    if (data.inactive === true) {
      return Response(res, "User successfully banned", null, 200);
    } else {
      return Response(res, "User successfully unbanned", null, 200);
    }
  }),
  getUserDetails: catchError(async (req, res) => {
    const { id } = req.query;
    const user = await userManagementServices.getUserDetails(
      id,
      unSelectData(["password", "security_code"])
    );
    return Response(res, "Success", user, 200);
  }),
  getUserTransactions: catchError(async (req, res) => {
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
      type: type,
      status: status,
      createdAt: getRange(start, end),
    };
    const data = await userManagementServices.getUserTransactions({
      userID: id,
      page,
      page_limit,
      filter: cleanData(filter),
      sort: sortBy(sort),
    });
    return Response(res, "Success", data, 200);
  }),
  //user
  getUser: catchError(async (req, res) => {
    const email = req.query.email;
    const data = await userServices.getUserByEmail(email);
    return Response(res, "Success", data, 200);
  }),
};
