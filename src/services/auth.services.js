const OTPServices = require("../services/otp.services");
const userServices = require("../services/user.services");
const tokenServices = require("../services/token.services");
const walletServices = require("../services/wallet.services");
const securityServices = require("../services/security.services");
const bcrypt = require("../utils/bcrypt");
const token = require("../utils/token");
const AppError = require("../helpers/handleError");
const { User } = require("../models/user.model");
const otpServices = require("../services/otp.services");
class AuthServices {
  static registerAccount = async (payload) => {
    const { email, password } = payload;
    await userServices.existsUserByEmail(email);
    const passwordHash = bcrypt.bcryptHash(password);
    const OTP = await OTPServices.createOTP(email, passwordHash);
    return { email, OTP };
  };
  static verifyRegister = async (email, otp) => {
    const password = await OTPServices.verifyOTP(email, otp);
    const user = await userServices.createUser(email, password);
    const userID = user._id;
    const token = tokenServices.createTokenPair("user", userID);
    await walletServices.createWallet(userID, "user");
    return token;
  };
  static updateSecurityCode = async (code, userID) => {
    const hashCode = bcrypt.bcryptHash(code);
    const user = await User.updateOne(
      { _id: userID },
      { security_code: hashCode }
    );
    if (user.modifiedCount === 0) {
      throw new AppError("Cập nhật thất bại", 400);
    }
  };
  static loginAccount = async (payload) => {
    const { email, password } = payload;
    const user = await userServices.getUserByEmail(email);
    const passwordHash = user.password;
    await securityServices.verifyPassword(user, password);
    const OTP = await OTPServices.createOTP(email, passwordHash);
    return { OTP, email };
  };
  static verifyLogin = async (body) => {
    const { email, otp } = body;
    await OTPServices.verifyOTP(email, otp);
    const user = await userServices.getUserByEmail(email);
    const token = tokenServices.createTokenPair("user", user._id);
    return token;
  };
  static refreshTokenAccess = async (refreshToken) => {
    const payload = token.verifyToken(refreshToken, process.env.REFRESH_KEY);
    const newToken = token.createToken(payload.id);
    await tokenServices.updateRefreshToken(refreshToken, newToken.refreshToken);
    return newToken;
  };
  static logoutAccount = async (refreshToken) => {
    await tokenServices.deleteRefreshToken(refreshToken);
  };
  static forgotPassword = async (email) => {
    await userServices.getUserByEmail(email);
    const OTP = await otpServices.createOTP(email, "");
    return { OTP, email };
  };
  static resetPassword = async ({ email, otp, password }) => {
    await otpServices.verifyOTP(email, otp);
    await userServices.resetPasswordUser(email, password);
  };
  static resendOtp = async ({ email, password }) => {
    await otpServices.createOTP(email, password);
  };
}
module.exports = AuthServices;
