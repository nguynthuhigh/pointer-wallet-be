const express = require('express')
const router = express.Router()
const roleAuth = require('../middlewares/role.middleware')
const ROLE = require('../utils/role')
const controller = require('../controller/payment.controlle')

router.post('/payment',controller.payment)
router.get('/payment-gateway',controller.paymentGateway)

module.exports = router