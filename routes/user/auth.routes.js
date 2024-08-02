const express = require('express')
const router = express.Router();
const AuthController = require('../../controllers/user/auth.controller')
const roleMiddleware = require("../../middlewares/role.middleware")
const validateMiddleware = require('../../middlewares/validate.middleware')
const ROLE = require('../../utils/role')
router.post('/signup',validateMiddleware.validateRegister,AuthController.Register)
router.post('/signup/verify',AuthController.VerifyAccount)
router.post('/signin',AuthController.Login)
router.post('/signin/verify',AuthController.VerifyLogin)

router.put('/update-security-code',roleMiddleware.Authenciation(ROLE.USER),AuthController.update_SecurityCode)
router.post('/resend-email',AuthController.ResendEmail)


//partner

module.exports = router;
