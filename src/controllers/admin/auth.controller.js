const catchError = require("../../middlewares/catchError.middleware");
const AdminAuthServices = require("../../services/admin/auth.services");
const { Response } = require("../../utils/response");
const createAdmin = catchError(async (req, res) => {
  await AdminAuthServices.createAdmin({ ...req.body });
  return Response(res, "Successfully!", null, 200);
});

const loginAdmin = catchError(async (req, res) => {
  const token = await AdminAuthServices.loginAdmin({ ...req.body });
  return Response(res, "Successfully!", { token }, 200);
});

const getAdmin = async (req, res) => {
  const data = await AdminAuthServices.getAllAdmins();
  return Response(res, "Successfully!", data, 200);
};
const deleteAdmin = async (req, res) => {};
module.exports = {
  createAdmin,
  loginAdmin,
  getAdmin,
  deleteAdmin,
};
