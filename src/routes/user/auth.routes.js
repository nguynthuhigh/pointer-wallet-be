const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/user/auth.controller");
const validateMiddleware = require("../../middlewares/validate.middleware");
const {
  authenticationUser,
} = require("../../middlewares/authentication.middleware");

router.post(
  "/signup",
  validateMiddleware.validateRegister,
  AuthController.Register
);
router
  .post("/signup/verify", AuthController.VerifyAccount)
  .post("/signin", AuthController.Login)
  .post("/signin/verify", AuthController.VerifyLogin)
  .post("/forgot-password", AuthController.forgotPassword)
  .post("/reset-password", AuthController.resetPassword)
  .post("/resend-otp", AuthController.resendOtp)
  .put(
    "/update-security-code",
    authenticationUser,
    AuthController.updateSecurityCode
  )
  .post("/log-out", AuthController.Logout)
  .post("/refresh-token", AuthController.refreshTokenAccess);

//partner

module.exports = router;
