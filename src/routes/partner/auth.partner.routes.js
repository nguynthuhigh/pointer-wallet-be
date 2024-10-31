const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/partner/auth.controller");

router.post("/sign-in-with-pointer", AuthController.signInWithPointer);
router.post("/refresh-token", AuthController.refreshToken);

module.exports = router;
