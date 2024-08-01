const express = require('express')
const router = express.Router();
const ROLE = require('../utils/role')
const AuthController = require('../controllers/partner/auth.controller')
const roleMiddleware = require("../middlewares/role.middleware")

router.post('/signup',AuthController.signUp)
router.post('/verify',AuthController.verifyAccount)

router.post('/signin',AuthController.signIn)
router.post('/resend-email',AuthController.ResendEmail)
router.get('/auth',roleMiddleware.Authenciation(ROLE.USER),AuthController.Auth)



module.exports = router;
