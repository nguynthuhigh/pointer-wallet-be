const AppError = require("../helpers/handleError");
const jwt = require("../utils/token");
const userService = require("../services/user.services");
const catchError = require("./catchError.middleware");
const { Partner } = require("../models/partner.model");
const Redis = require("../helpers/redis.helpers");
const { verifyAccessToken } = require("../services/sso.services");
const AdminServices = require("../services/admin/auth.services");
module.exports = {
  authenticationUser: catchError(async (req, res, next) => {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
      throw new AppError("Unauthorized", 401);
    }
    const payload = jwt.verifyToken(accessToken, process.env.ACCESS_KEY);
    const user = await userService.getUserById(payload.id);
    req.user = user._id;
    req.security_code = user.security_code;
    req.user_info = user;
    next();
  }),
  authenticationAdmin: catchError(async (req, res, next) => {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
      throw new AppError("Unauthorized", 401);
    }
    const payload = jwt.verifyToken(accessToken, process.env.ACCESS_KEY_ADMIN);
    const { id } = payload;
    const token = await Redis.get(`access_admin:${id.toString()}`);
    if (!token) {
      throw new AppError("Unauthorized", 401);
    }
    await AdminServices.findAdminById(id);
    next();
  }),
  authenticationPartner: catchError(async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Unauthorized", 401);
    }
    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) {
      throw new AppError("Unauthorized", 401);
    }
    const payload = await verifyAccessToken(accessToken);
    const partner = await Partner.findOne({ email: payload.email });
    if (!partner) {
      throw new AppError("Unauthorized", 401);
    }
    req.partner = partner;
    next();
  }),
};
