const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/auth.controller')

router.post('/sign-in',controller.signIn)
router.post('/add-admin',controller.createAccount)
router.get('/get-all-admins',controller.getAllAdmins)
router.patch('/ban-admin',controller.banAdmin)
router.post('/refresh-token',controller.refreshToken)






module.exports = router