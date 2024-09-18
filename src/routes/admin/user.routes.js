const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/user_management.controller')
router.get('/get-users',controller.getUsers)
router.patch('/ban-user',controller.banUser)
router.get('/get-transactions',controller.getUserTransactions)
router.get('/get-details',controller.getUserDetails)
//user
router.get('/get-user',controller.getUser)



module.exports = router