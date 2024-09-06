const express = require('express')
const router = express.Router();
const settingController = require('../../controllers/user/setting.controller')
const validateMiddleware = require('../../middlewares/validate.middleware')
const {authenticationUser} = require('../../middlewares/authentication.middleware')
const upload = require('../../middlewares/multer.middleware')

router.post('/change-password',authenticationUser,settingController.changePassword)
router.post('/change-security-code',authenticationUser,settingController.changeSecurityCode)
router.post('/edit-profile',upload.single('image'),authenticationUser,settingController.editProfile)

module.exports = router;
