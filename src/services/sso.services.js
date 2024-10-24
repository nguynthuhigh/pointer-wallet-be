const { PointerStrategy } = require("sso-pointer");
const AppError = require("../helpers/handleError");
const pointer = new PointerStrategy({ apiKey: "" });

module.exports = {
  getAccessToken: async (code) => {
    return await pointer.getAccessToken(code);
  },
  verifyAccessToken: async (token) => {
    try {
      return await pointer.verifyAccessToken({
        accessToken: token,
        session: false,
      });
    } catch (error) {
      throw new AppError("Unauthorized", 401);
    }
  },
};
