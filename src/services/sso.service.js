const { PointerStrategy } = require("sso-pointer");
const pointer = new PointerStrategy({ apiKey: "" });

module.exports = {
  getAccessToken: async (code) => {
    return await pointer.getAccessToken(code);
  },
  verifyAccessToken: async (token) => {
    return await pointer.verifyAccessToken({
      accessToken: token,
      session: false,
    });
  },
};
