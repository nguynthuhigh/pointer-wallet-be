const { Response } = require("../../utils/response");
const catchError = require("../../middlewares/catchError.middleware");
const AuthPartnerServices = require("../../services/partner/auth.services");
const { setCookie } = require("../../utils/cookie");
module.exports = {
  signInWithPointer: catchError(async (req, res) => {
    const tokens = await AuthPartnerServices.signInWithPointer(req.body.code);
    setCookie(res, tokens.refreshToken, "refresh_token");
    return Response(res, "Success", { token: tokens.accessToken }, 200);
  }),
  refreshToken: catchError(async (req, res) => {
    const { refreshToken, accessToken } =
      await AuthPartnerServices.refreshToken(req.cookies["refresh_token"]);
    setCookie(res, refreshToken, "refresh_token");
    setCookie(res, accessToken, "access_token");
    return Response(res, "Success", null, 200);
  }),
};
