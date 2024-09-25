const { Partner } = require("../../models/partner.model");
const OTPservices = require("../../services/OTP.services");
const bcrypt = require("../../utils/bcrypt");
const nodemailer = require("../../utils/nodemailer");
const { Response } = require("../../utils/response");
const { OTP_Limit } = require("../../models/otp_limit.model");
const catchError = require("../../middlewares/catchError.middleware");
const AuthPartnerServices = require("../../services/partner/auth.services");
const { setCookie } = require("../../utils/cookie");
module.exports = {
  signUp: catchError(async (req, res) => {
    const { email, password } = req.body;
    const otp = await AuthPartnerServices.signUp(email, password);
    nodemailer.sendMail(
      email,
      "Mã OTP của bạn " + otp,
      "Chúng tôi đến từ pressPay!"
    );
    Response(res, "Vui lòng kiểm tra email", null, 200);
  }),
  verifyAccount: catchError(async (req, res) => {
    const { email, otp } = req.body;
    const { refreshToken, accessToken } =
      await AuthPartnerServices.verifySignUp(email, otp);
    setCookie(res, refreshToken, "refresh_token");
    setCookie(res, accessToken, "access_token");
    res.status(200).json({ message: "success", token: token });
  }),
  //using multer!
  updateProfile: catchError(async (req, res) => {
    const id = req.partner._id;
    await Partner.findByIdAndUpdate({ id }, req.body);
    return Response(res, "Update profile successfully", null, 200);
  }),
  signIn: catchError(async (req, res) => {
    const { email, password } = req.body;
    const { refreshToken, accessToken } = await AuthPartnerServices.signIn(
      email,
      password
    );
    setCookie(res, refreshToken, "refresh_token");
    setCookie(res, accessToken, "access_token");
    return Response(res, "Đăng nhập thành công", null, 200);
  }),
  signInWithPointer: catchError(async (req, res) => {
    const tokens = await AuthPartnerServices.signInWithPointer(req.body.code);
    setCookie(res, tokens.refreshToken, "refresh_token");
    setCookie(res, tokens.accessToken, "access_token");
    return Response(res, "Success", null, 200);
  }),
  refreshToken: catchError(async (req, res) => {
    const { refreshToken, accessToken } =
      await AuthPartnerServices.refreshToken(req.cookies["refresh_token"]);
    setCookie(res, refreshToken, "refresh_token");
    setCookie(res, accessToken, "access_token");
    return Response(res, "Success", null, 200);
  }),
  ResendEmail: catchError(async (req, res) => {
    const { email, password } = req.body;
    const user = await Partner.findOne({ email: email });
    if (user) {
      return res.status(400).json({ message: "Account already exists" });
    }
    const count = await OTPservices.countOTP(email);
    if (count < 3) {
      const passwordHash = bcrypt.bcryptHash(password);
      console.log(passwordHash);
      const OTP = await OTPservices.createOTP(email, passwordHash);
      console.log(OTP);
      await OTP_Limit.create({ email: email });
      await nodemailer.sendMail(
        email,
        "Mã OTP của bạn " + OTP + " Vui lòng không gửi cho bất kì ai",
        "Chúng tôi đến từ pressPay!"
      );
      return Response(res, "Check your email", "", 200);
    } else {
      return Response(res, "Please try again after 1 hour", "", 400);
    }
  }),
};
