const jwt = require("jsonwebtoken");
const AppError = require("../helpers/handleError");
module.exports = {
  createToken: (id) => {
    const payload = {
      id: id,
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_KEY, {
      algorithm: "HS256",
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_KEY, {
      algorithm: "HS256",
      expiresIn: "14d",
    });
    return { accessToken, refreshToken };
  },
  verifyToken: (token, key) => {
    try {
      return jwt.verify(token, key);
    } catch (error) {
      throw new AppError("Unauthorized", 401);
    }
  },
};
