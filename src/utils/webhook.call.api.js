const axios = require("axios");
const AppError = require("../helpers/handleError");

module.exports = {
  postWebhook: async (endpoint, body, session) => {
    try {
      await axios.post(endpoint, body);
    } catch (error) {
      await session.abortTransaction();
      throw new AppError("Lỗi hệ thống bên phía đối tác vui lòng thử lại", 500);
    }
  },
};
