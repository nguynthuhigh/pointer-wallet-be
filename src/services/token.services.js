const token = require("../utils/token");
const Key = require("../models/keys.model");
const AppError = require("../helpers/handleError");
const Redis = require("../helpers/redis.helpers");
const createKey = async (type, id, refreshToken) => {
  switch (type) {
    case "partner":
      return await Key.create({
        refresh_token: refreshToken,
        partnerID: id,
      });
    case "user":
      return await Key.create({
        refresh_token: refreshToken,
        userID: id,
      });
    default:
      throw new AppError("Type not defined", 400);
  }
};
module.exports = {
  createTokenAdmin: async (id) => {
    const accessToken = token.createTokenAdmin(id.toString());
    await Redis.set(`access_admin:${id.toString()}`, token, 60 * 15);
    await Key.create({
      access_token: accessToken,
      userID: id,
    });
    return accessToken;
  },
  createTokenPair: async (type, id) => {
    const { accessToken, refreshToken } = token.createToken(id);
    const data = await createKey(type, id, refreshToken);
    if (!data) {
      throw new AppError("Error create token", 404);
    }
    return { accessToken, refreshToken };
  },
  updateRefreshToken: async (refreshTokenOld, refreshTokenNew) => {
    const token = await Key.updateOne(
      { refresh_token: refreshTokenOld },
      { refresh_token: refreshTokenNew }
    );
    if (token.modifiedCount === 0) {
      throw new AppError("Fail refresh token", 400);
    }
  },
  deleteRefreshToken: async (refreshToken) => {
    const token = await Key.deleteOne({ refresh_token: refreshToken });
    if (token.deletedCount === 0) {
      throw new AppError("Fail log out, try again", 400);
    }
  },
};
