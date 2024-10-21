const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/partner/auth.controller");

// router.post("/signup", AuthController.signUp);
// router.post("/verify", AuthController.verifyAccount);
// router.post("/signin", AuthController.signIn);
router.post("/sign-in-with-pointer", AuthController.signInWithPointer);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/resend-email", AuthController.ResendEmail);

module.exports = router;
