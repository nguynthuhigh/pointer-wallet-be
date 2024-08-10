const express = require('express')
const router = express.Router()
const ROLE = require('../../utils/role')
const controller = require('../../controllers/admin/admin.controller')
const middleware = require('../../middlewares/role.middleware')

router.post('/sign-in',controller.signIn)
router.post('/add-admin',middleware.Authentication_Admin(ROLE.ADMIN),controller.createAccount)
router.get('/get-all-admins',middleware.Authentication_Admin(ROLE.ADMIN),controller.getAllAdmins)
router.patch('/ban-admin',middleware.Authentication_Admin(ROLE.ADMIN),controller.banAdmin)





module.exports = router