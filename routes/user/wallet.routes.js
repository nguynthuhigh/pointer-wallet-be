const express = require('express')
const router = express.Router()

const controller = require('../../controllers/user/wallet.controller')
const {authenticationUser} = require('../../middlewares/authentication.middleware')
const {validate } = require('../../middlewares/validate.middleware')
const { depositMoneySchema } = require('../../validates/wallet.validate')

router.post('/send-money',authenticationUser,controller.sendMoney)
router.post('/deposit-money',validate(depositMoneySchema),authenticationUser,controller.depositMoney)
router.post('/withdraw-money',authenticationUser,controller.withdrawMoney)

module.exports = router