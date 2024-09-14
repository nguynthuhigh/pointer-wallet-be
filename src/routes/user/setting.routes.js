const express = require('express')
const router = express.Router();
const settingController = require('../../controllers/user/setting.controller')
const validateMiddleware = require('../../middlewares/validate.middleware')
const {authenticationUser} = require('../../middlewares/authentication.middleware')
const upload = require('../../middlewares/multer.middleware')

router.patch('/change-password',authenticationUser,settingController.changePassword)
router.patch('/change-security-code',authenticationUser,settingController.changeSecurityCode)
router.put('/edit-profile',authenticationUser,upload.single('image'),settingController.editProfile)

module.exports = router;
