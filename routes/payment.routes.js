const express = require('express')
const router = express.Router()
const roleAuth = require('../middlewares/role.middleware')
const ROLE = require('../utils/role')
const controller = require('../controller/payment.controlle')

router.post('/api/v1/payment',controller.payment)
router.post('/api/v1/refund',controller.refundMoney)

router.get('/payment-gateway',controller.paymentGateway)
router.get('/payment/test',controller.testRedirect)
router.post('/api/v1/confirm-payment',roleAuth.Authenciation(ROLE.USER),controller.confirmPayment)




module.exports = router