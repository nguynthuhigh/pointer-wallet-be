const AppError = require("../helpers/handleError");
const token = require("../utils/token");
const userService = require("../services/user.services");
const catchError = require("./catchError.middleware");
const AdminServices = require("../services/admin/admin.services");
const { PartnerServices } = require("../services/partner/partner.services");
module.exports = {
  authenticationUser: catchError(async (req, res, next) => {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
      throw new AppError("Unauthorized", 401);
    }
    console.log(accessToken);
    const payload = token.verifyToken(accessToken, process.env.ACCESS_KEY);
    const user = await userService.getUserById(payload.id);
    req.user = user._id;
    req.security_code = user.security_code;
    req.user_info = user;
    next();
  }),
  authenticationAdmin: catchError(async (req, res, next) => {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
      throw new AppError("Unauthorized", 401);
    }
    const payload = token.verifyToken(accessToken);
    const admin = await AdminServices.findAdminById(payload.id);
    next();
  }),
  authenticationPartner: catchError(async (req, res, next) => {
    const accessToken = req.cookies["access_token"];
    if (!accessToken) {
      throw new AppError("Unauthorized", 401);
    }
    const payload = token.verifyToken(accessToken);
    const partner = await PartnerServices.findPartnerById(payload.id);
    req.partner = partner;
    next();
  }),
};
