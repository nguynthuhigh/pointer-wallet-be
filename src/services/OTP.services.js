const AppError = require("../helpers/handleError");
const { OTP } = require("../models/otp.model");
const bcrypt = require("../utils/bcrypt");
const otpGenerator = require("otp-generator");
const Redis = require("../helpers/redis.helpers");
module.exports = {
  createOTP: async (email, passwordHash) => {
    const countOTP = await Redis.get(`otp_limit:${email}`);
    if (countOTP >= 3) {
      throw new AppError(
        "Bạn đã gửi mã otp quá 3 lần vui lòng thử lại sau 1 tiếng",
        400
      );
    }
    const OTP_Generator = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const hash = bcrypt.bcryptHash(OTP_Generator);
    await OTP.create({ email: email, password: passwordHash, otp: hash });
    await Redis.incr(`otp_limit:${email}`, 60 * 60);
    console.log(OTP_Generator);
    return OTP_Generator;
  },
  verifyOTP: async (email, otp) => {
    const otpArray = await OTP.find({ email: email });
    otpSchema = otpArray[otpArray.length - 1];
    if (!otpSchema) {
      throw new AppError("Mã OTP không hợp lệ", 400);
    }
    const result = bcrypt.bcryptCompare(otp, otpSchema.otp);
    if (!result) {
      throw new AppError("Mã OTP không hợp lệ", 400);
    }
    await OTP.deleteMany({ email: email });
    return otpSchema.password;
  },
  addToken: async (body) => {
    return await OTP.create(body);
  },
  findOTP: async (body) => {
    return await OTP.find(body);
  },
};
