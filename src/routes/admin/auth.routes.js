const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/auth.controller')
const { CheckToken } = require('../../middlewares/auth.middle')

router.post('/add-admin',CheckToken,controller.createAdmin)
router.post('/sign-in-admin',controller.loginAdmin)
router.get('/get-admin',CheckToken,controller.getAdmin)
router.delete('/delete-admin/:id',CheckToken,controller.deleteAdmin)

module.exports = router