const express = require('express')
const router = express.Router();
const AuthController = require('../controller/partner/auth.controller')
router.post('/signup',AuthController.signUp)
router.post('/verify',AuthController.verifyAccount)

router.post('/signin',AuthController.signIn)
router.post('/resend-email',AuthController.ResendEmail)



module.exports = router;
