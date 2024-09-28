const { Response } = require("../../utils/response");
const catchError = require("../../middlewares/catchError.middleware");
const AuthAdminServices = require("../../services/admin/auth.services");
const { setCookie } = require("../../utils/cookie");

module.exports = {
  //[POST] /api/v1/admin/add-admin
  createAccount: catchError(async (req, res) => {
    const { email, password, role } = req.body;
    const data = await AuthAdminServices.createAdmin(email, password, role);
    Response(res, "New member successfully added", data, 200);
  }),
  //[POST] /api/v1/admin/sign-in
  signIn: catchError(async (req, res) => {
    const userIP = req.ip || req.connection.remoteAddress;
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await AuthAdminServices.loginAccount(
      email,
      password,
      userIP
    );
    setCookie(res, refreshToken, "refresh_token");
    setCookie(res, accessToken, "access_token");
    Response(res, "Sign in successfully", null, 200);
  }),
  //[GET] /api/v1/admin/refresh-token
  refreshToken: catchError(async (req, res) => {
    const { refreshToken, accessToken } = await AuthAdminServices.refreshToken(
      req.cookies.refresh_token
    );
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 15 * 1000,
    });
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 15 * 1000,
    });
    Response(res, "Success", null, 200);
  }),
  //[GET] /api/v1/admin/get-all-admins
  getAllAdmins: catchError(async (req, res) => {
    const data = await AuthAdminServices.getAllAdmins();
    return Response(res, "Success", data, 200);
  }),
  //[PATCH] /api/v1/admin/ban-admin
  banAdmin: catchError(async (req, res) => {
    const { id } = req.body;
    const data = await AuthAdminServices.banAdmin(id);
    if (data.active === true) {
      return Response(res, "Member successfully unbanned", null, 200);
    } else {
      return Response(res, "Member successfully banned", null, 200);
    }
  }),
};
