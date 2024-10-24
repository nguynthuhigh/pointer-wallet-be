const AppError = require("../helpers/handleError");
const token = require("../utils/token");
const userService = require("../services/user.services");
const catchError = require("./catchError.middleware");
const { verifyAccessToken } = require("../services/sso.services");
const { Partner } = require("../models/partner.model");
module.exports = {
  authenticationUser: catchError(async (req, res, next) => {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
      throw new AppError("Unauthorized", 401);
    }
    const payload = token.verifyToken(accessToken, process.env.ACCESS_KEY);
    const user = await userService.getUserById(payload.id);
    req.user = user._id;
    req.security_code = user.security_code;
    req.user_info = user;
    next();
  }),
  // authenticationAdmin: catchError(async (req, res, next) => {
  //   const accessToken = req.cookies.access_token;
  //   if (!accessToken) {
  //     throw new AppError("Unauthorized", 401);
  //   }
  //   const payload = token.verifyToken(accessToken);
  //   const admin = await AdminServices.findAdminById(payload.id);
  //   next();
  // }),
  authenticationPartner: catchError(async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Access token is missing or invalid" });
    }
    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) {
      throw new AppError("Unauthorized", 401);
    }
    const payload = await verifyAccessToken(accessToken);
    const partner = await Partner.findOne({ email: payload.email });
    req.partner = partner;
    next();
  }),
};
