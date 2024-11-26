const { Admin } = require("../../models/admin.model");
const { User } = require("../../models/user.model");

const bcrypt = require("../../utils/bcrypt");
const tokenServices = require("../../services/token.services");
const tokenUtils = require("../../utils/token");
const Key = require("../../models/keys.model");
const AppError = require("../../helpers/handleError");
const convertToObjectId = require("../../utils/convert-type-object");
const userServices = require("../user.services");
class AuthAdminServices {
  static findAdminById = async (id) => {
    const user = await User.findById(convertToObjectId(id));
    if (user.role != "admin") {
      throw new AppError("Something went wrong", 401);
    }
    return user;
  };
  static createAdmin = async ({ email, password, full_name }) => {
    const passwordHash = bcrypt.bcryptHash(password);
    await userServices.existsUserByEmail(email);
    const data = await User.create({
      full_name,
      email,
      password: passwordHash,
      role: "admin",
    });
    return data;
  };
  static loginAdmin = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user || !bcrypt.bcryptCompare(password, user.password) || !user.role) {
      throw new AppError("Something went wrong!", 400);
    }
    const token = await tokenServices.createTokenAdmin(user._id);
    return token;
  };
  static getAllAdmins = async () => {
    return await User.find({ role: "admin" });
  };
  static banAdmin = async (id) => {};
  static refreshToken = async (refreshToken) => {
    const token = await Key.findOne({ refresh_token: refreshToken });
    if (!token) {
      throw new AppError("Unauthorized", 401);
    }
    tokenUtils.verifyToken(token);
    const newToken = tokenServices.createTokenPair(token.adminID);
    const result = await Key.findOneAndUpdate(
      { refresh_token: refreshToken },
      { refresh_token: newToken.refreshToken }
    );
    if (result.modifiedCount === 0) {
      throw new AppError("Error refresh token", 500);
    }
    return newToken;
  };
}
module.exports = AuthAdminServices;
