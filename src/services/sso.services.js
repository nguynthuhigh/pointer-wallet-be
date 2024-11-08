const axios = require("axios");
const { jwtDecode } = require("jwt-decode");

const AppError = require("../helpers/handleError");

const axiosInstance = axios.create({
  baseURL: "https://oauth.pointer.io.vn",
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = {
  async isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token);
      if (!decoded.exp) {
        return false;
      }
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      throw new AppError("Unauthorized", 401);
    }
  },
  async getAccessToken(code) {
    const response = await axiosInstance.post("/auth/access-token", {
      clientId: process.env.POINTER_CLIENT_ID,
      clientSecret: process.env.POINTER_CLIENT_SECRET,
      code,
    });
    return response.data;
  },
};
