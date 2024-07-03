const express = require('express')
const router = express.Router();
const AuthController = require('../controller/auth.controller')
const roleMiddleware = require("../middlewares/role.middleware")
const ROLE = require('../utils/role')
router.post('/signup',AuthController.Register)
router.post('/signup/verify',AuthController.VerifyAccount)
router.post('/signin',AuthController.Login)
router.post('/signin/verify',AuthController.VerifyLogin)


router.put('/update-security-code',roleMiddleware.Authenciation(ROLE.USER),AuthController.update_SecurityCode)

//partner

module.exports = router;
