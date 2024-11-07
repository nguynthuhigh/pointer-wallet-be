const { Partner } = require("../../models/partner.model");
const AppError = require("../../helpers/handleError");
const tokenServices = require("../token.services");
const token = require("../../utils/token");
const walletService = require("../../services/wallet.services");
const { getAccessToken } = require("../sso.services");
const { generateKeyPair } = require("../../utils/crypto-js");
class PartnerServices {
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
    const { privateKey, publicKey } = generateKeyPair();
    const createdPartner = await Partner.create({
      email: email,
      privateKey: privateKey,
      publicKey: publicKey,
    });
    await walletService.createWallet(createdPartner._id, "partner");
  };
  static signInWithPointer = async (code) => {
    const { accessToken, user } = await getAccessToken(code);
    const partnerFind = await Partner.findOne({ email: user.email });
    if (!partnerFind) {
      await this.createPartner(user.email);
    }
    return { accessToken: accessToken };
  };
}

module.exports = PartnerServices;
