const express = require('express')
const router = express.Router();
const AuthController = require('../controller/partner/auth.controller')
const roleMiddleware = require("../middlewares/role.middleware");
const authController = require('../controller/auth.controller');
const ROLE = require('../utils/role')

router.post('/signup',AuthController.signUp)
router.post('/verify',AuthController.verifyAccount)

router.post('/signin',AuthController.signIn)



module.exports = router;
