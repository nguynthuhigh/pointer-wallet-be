const express = require('express')
const router = express.Router()
const roleAuth = require('../../middlewares/role.middleware')
const ROLE = require('../../contains/role')
const controller = require('../../controllers/admin/user_management.controller')
const upload = require('../../middlewares/multer.middleware')
const {authenticationUser} = require('../../middlewares/authentication.middleware')
router.get('/get-users',roleAuth.Authentication_Admin(ROLE.ADMIN),controller.getUsers)
router.put('/ban-user',roleAuth.Authentication_Admin(ROLE.ADMIN),controller.banUser)
router.get('/get-transactions',roleAuth.Authentication_Admin(ROLE.ADMIN),controller.getTransactionsUser)

//user
router.get('/get-user',controller.getUser)



module.exports = router