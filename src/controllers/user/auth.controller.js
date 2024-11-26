const { Response } = require("../../utils/response");
const nodemailer = require("../../utils/nodemailer");
const catchError = require("../../middlewares/catchError.middleware");
const AuthServices = require("../../services/auth.services");
const { setCookie } = require("../../utils/cookie");
module.exports = {
  Register: catchError(async (req, res) => {
    const data = await AuthServices.registerAccount(req.body);
    const { email, OTP } = data;
    await nodemailer.sendMail(
      email,
      "Mã OTP của bạn " + OTP + " Vui lòng không gửi cho bất kì ai",
      "Chúng tôi đến từ pressPay!"
    );
    return Response(res, "Vui lòng kiểm tra email của bạn", email, 200);
  }),
  VerifyAccount: catchError(async (req, res) => {
    const { email, otp } = req.body;
    const { accessToken, refreshToken } = await AuthServices.verifyRegister(
      email,
      otp
    );
    setCookie(res, refreshToken, "refresh_token");
    return Response(res, "Đăng ký thành công", accessToken, 200);
  }),
  updateSecurityCode: catchError(async (req, res) => {
    await AuthServices.updateSecurityCode(req.body.security_code, req.user);
    return Response(res, "Cập nhật mã bảo mật thành công", null, 200);
  }),
  Login: catchError(async (req, res) => {
    const { OTP, email } = await AuthServices.loginAccount(req.body);
    nodemailer.sendMail(
      email,
      "Mã OTP đăng nhập của bạn là " +
        OTP +
        "\n Vui lòng không gửi cho bất kỳ ai.",
      "Chúng tôi đến từ pressPay!"
    );
    return Response(res, "Kiểm tra email để xác nhận", null, 200);
  }),
  VerifyLogin: catchError(async (req, res) => {
    const { accessToken, refreshToken } = await AuthServices.verifyLogin(
      req.body
    );
    setCookie(res, refreshToken, "refresh_token");
    return Response(res, "Đăng nhập thành công", accessToken, 200);
  }),
  Logout: catchError(async (req, res) => {
    await AuthServices.logoutAccount(req.cookies.refresh_token);
    Response(res, "Logout Success", null, 200);
  }),
  refreshTokenAccess: catchError(async (req, res) => {
    const { accessToken, refreshToken } = await AuthServices.refreshTokenAccess(
      req.cookies["refresh_token"]
    );
    setCookie(res, refreshToken, "refresh_token");
    return Response(res, "refresh token success", accessToken, 200);
  }),
  forgotPassword: catchError(async (req, res) => {
    await AuthServices.forgotPassword(req.body.email);
    return Response(res, "Vui lòng kiểm tra email của bạn", null, 200);
  }),
  resetPassword: catchError(async (req, res) => {
    await AuthServices.resetPassword({ ...req.body });
    return Response(res, "Khôi phục mật khẩu thành công", null, 200);
  }),
  resendOtp: catchError(async (req, res) => {
    await AuthServices.resendOtp({ ...req.body });
    return Response(res, "Kiểm tra email để xác nhận", null, 200);
  }),
};
