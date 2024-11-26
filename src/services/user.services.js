const AppError = require("../helpers/handleError");
const { User } = require("../models/user.model");
const { Wallet } = require("../models/wallet.model");
const bcrypt = require("../utils/bcrypt");
const redis = require("../helpers/redis.helpers");
module.exports = {
  getUserById: async (id) => {
    const userData = await User.findById(id);
    if (!userData) {
      throw new AppError("User not found", 401);
    }
    return userData;
  },
  getUserByEmail: async (email) => {
    const userData = await User.findOne({ email: email });
    if (!userData) {
      throw new AppError("User not found", 404);
    }
    return userData;
  },
  resetPasswordUser: async (email, password) => {
    const hashPassword = bcrypt.bcryptHash(password);
    return await User.updateOne({ email: email }, { password: hashPassword });
  },
  existsUserByEmail: async (email) => {
    const userData = await User.findOne({ email: email });
    if (userData) {
      throw new AppError("Tài khoản đã tồn tại", 404);
    }
    return userData;
  },
  createUser: async (email, password) => {
    const user = await User.create({ email: email, password: password });
    if (!user) {
      throw new AppError("Lỗi tạo tài khoản", 400);
    }
    return user;
  },
  changePassword: async (oldPassword, newPassword, userData) => {
    if (!bcrypt.bcryptCompare(oldPassword, userData.password)) {
      throw new AppError("Mật khẩu cũ không đúng", 400);
    }
    const hashPassword = bcrypt.bcryptHash(newPassword);
    const result = await User.updateOne(
      { _id: userData._id },
      { password: hashPassword }
    );
    if (result.modifiedCount === 0) {
      throw new AppError("Đổi mật khẩu thất bại", 500);
    }
    return;
  },
  changeSecurityCode: async (oldCode, newCode, userData) => {
    if (!bcrypt.bcryptCompare(oldCode, userData.security_code)) {
      throw new AppError("Mã bảo mật cũ không đúng", 400);
    }
    const hashPassword = bcrypt.bcryptHash(newCode);
    const result = await User.updateOne(
      { _id: userData._id },
      { security_code: hashPassword }
    );
    if (result.modifiedCount === 0) {
      throw new AppError("Mã bảo mật thất bại", 500);
    }
    return;
  },
  editProfile: async (data) => {
    const result = await User.updateOne({ _id: data._id }, data);
    if (result.modifiedCount === 0) {
      throw new AppError("Cập nhật thất bại vui lòng thử lại", 200);
    }
    await redis.del(`user:${data._id}`);
  },
  getProfile: async (userData) => {
    const userRedis = await redis.get(`user:${userData._id}`);
    if (!userRedis) {
      const walletData = await Wallet.findOne({ userID: userData._id })
        .populate("currencies.currency")
        .lean()
        .exec();
      await redis.set(
        `user:${userData._id}`,
        JSON.stringify({
          userData: userData,
          walletData: walletData,
        }),
        600
      );
      return {
        userData: userData,
        walletData: walletData,
      };
    }
    return JSON.parse(userRedis);
  },
};
