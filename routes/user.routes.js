const express = require('express')
const router = express.Router()
const roleAuth = require('../middlewares/role.middleware')
const ROLE = require('../utils/role')
const controller = require('../controller/user.controller')


router.get('/getusers',roleAuth.verifyRole(ROLE.ADMIN),controller.getUsers)
router.put('/ban/user',roleAuth.verifyRole(ROLE.ADMIN),controller.banUser)
router.put('/unban/user',roleAuth.verifyRole(ROLE.ADMIN),controller.unbanUser)
//user
router.put('/update-profile',roleAuth.Authenciation(ROLE.USER),controller.updateProfile)
router.get('/profile',roleAuth.Authenciation(ROLE.USER),controller.Profile)


module.exports = router