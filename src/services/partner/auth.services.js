const { Partner } = require("../../models/partner.model");
const bcrypt = require("../../utils/bcrypt");
const AppError = require("../../helpers/handleError");
const tokenServices = require("../token.services");
const OTPServices = require("../otp.services");
const token = require("../../utils/token");
const walletService = require("../../services/wallet.services");
const { getAccessToken } = require("../sso.service");
class PartnerServices {
  // static signIn = async (email, password) => {
  //   const partnerFind = await Partner.findOne({ email: email });
  //   if (!partnerFind) {
  //     throw new AppError("Tài khoản hoặc mật khẩu không đúng", 400);
  //   }
  //   const passwordHash = partnerFind.password;
  //   if (!bcrypt.bcryptCompare(password, passwordHash)) {
  //     throw new AppError("Tài khoản hoặc mật khẩu không đúng", 400);
  //   }
  //   const token = await tokenServices.createTokenPair(
  //     "partner",
  //     partnerFind._id.toString()
  //   );
  //   return token;
  // };
  // static signUp = async (email, password) => {
  //   const partner = await Partner.findOne({ email: email });
  //   if (partner) {
  //     throw new AppError("Email is exists", 400);
  //   }
  //   const passwordHash = bcrypt.bcryptHash(password);
  //   const OTP = await OTPServices.createOTP(email, passwordHash);
  //   return OTP;
  // };
  // static verifySignUp = async (email, otp) => {
  //   await OTPServices.verifyOTP(email, otp);
  //   const partner = await Partner.findOne({ _id: partner });
  //   if (partner) {
  //     throw new AppError("Email is exists", 400);
  //   }
  //   const data = tokenServices.createTokenPair(partner._id);
  //   return data;
  // };
  static refreshToken = async (refreshToken) => {
    if (!refreshToken) {
      throw new AppError("Unauthorized", 401);
    }
    const tokenCurrent = await tokenServices.findRefreshToken(refreshToken);
    token.verifyToken(refreshToken);
    const newToken = token.createToken(tokenCurrent.partnerID);
    await tokenServices.updateRefreshToken(refreshToken, newToken.refreshToken);
    return newToken;
  };
  static createPartner = async (email) => {
    const createdPartner = await Partner.create({
      email: email,
    });
    await walletService.createWallet(createdPartner._id, "partner");
  };
  static signInWithPointer = async (code) => {
    const { accessToken, email, id } = await getAccessToken(code);
    const partnerFind = await Partner.findOne({ email: email });
    if (!partnerFind) {
      await this.createPartner(email);
    }
    return { accessToken: accessToken };
  };
}

module.exports = PartnerServices;
