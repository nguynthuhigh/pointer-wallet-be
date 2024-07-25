const express = require('express')
const router = express.Router()
const roleAuth = require('../middlewares/role.middleware')
const ROLE = require('../utils/role')
const controller = require('../controller/payment.controller')
const validate = require('../middlewares/validate.middleware')

router.post('/api/v1/payment',validate.validatePayment,controller.payment)
router.post('/api/v1/refund',controller.refundMoney)

router.get('/payment-gateway',controller.paymentGateway)
router.post('/payment/test',controller.testRedirect)
router.post('/api/v1/confirm-payment',roleAuth.Authenciation(ROLE.USER),controller.confirmPayment)
router.post('/api/v1/apply-voucher',controller.applyVoucher)
router.get('/api/v1/get-session',controller.getSession)
router.post('/api/v1/payment-with-card',controller.payWithCard)



module.exports = router