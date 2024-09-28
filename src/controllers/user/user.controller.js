const userService = require("../../services/user.services");
const { Response } = require("../../utils/response");
const catchError = require("../../middlewares/catchError.middleware");
module.exports = {
  getProfile: catchError(async (req, res) => {
    const data = await userService.getProfile(req.user_info);
    return Response(res, "Success", data, 200);
  }),
};
