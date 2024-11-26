const bcrypt = require("../utils/bcrypt");
const AppError = require("../helpers/handleError");
const Redis = require("../helpers/redis.helpers");
const { sendMail } = require("../utils/nodemailer");
const verifySecurityCode = async (code, hashCode, limit, user) => {
  const wrongCount = await Redis.get(`security_code:${user._id}`);
  if (wrongCount >= limit) {
    wrongCount === 3 &&
      (await sendMail(
        user.email,
        "You have entered the wrong security code more than 3 times, please be careful",
        "[Pointer Wallet] Warning Security!"
      ));
    throw new AppError(
      `Bạn đã nhập mã bảo mật sai quá ${limit} lần vui lòng thử lại sau 10 phút`,
      400
    );
  }
  if (!bcrypt.bcryptCompare(code, hashCode)) {
    await Redis.incr(`security_code:${user._id}`, 600);
    throw new AppError("Mã bảo mật không đúng", 400);
  }
};
const verifyPassword = async (user, password) => {
  const { password: passwordHash, _id } = user;
  const wrongCount = await Redis.get(`password:${_id}`);
  if (wrongCount >= 3) {
    throw new AppError(
      `Bạn đã nhập mật khẩu sai quá 3 lần vui lòng thử lại sau 1 tiếng`,
      400
    );
  }
  if (!bcrypt.bcryptCompare(password, passwordHash)) {
    const ONE_HOUR = 60 * 60;
    await Redis.incr(`password:${_id}`, ONE_HOUR);
    throw new AppError("Tài khoản hoặc mật khẩu không đúng", 400);
  }
};
module.exports = { verifySecurityCode, verifyPassword };
