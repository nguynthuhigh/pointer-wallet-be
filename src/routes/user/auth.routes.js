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
router.post("/signup/verify", AuthController.VerifyAccount);
router.post("/signin", AuthController.Login);
router.post("/signin/verify", AuthController.VerifyLogin);
router.post("/request-reset-password");
router.post("/reset-password");
router.put(
  "/update-security-code",
  authenticationUser,
  AuthController.updateSecurityCode
);
router.post("/resend-email");
router.post("/log-out", AuthController.Logout);
router.post("/refresh-token", AuthController.refreshTokenAccess);

//partner

module.exports = router;
