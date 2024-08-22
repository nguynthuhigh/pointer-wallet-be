const express = require('express')
const router = express.Router()

const controller = require('../../controllers/user/wallet.controller')
const {authenticationUser} = require('../../middlewares/authentication.middleware')

router.post('/send-money',authenticationUser,controller.sendMoney)
router.post('/deposit-money',authenticationUser,controller.depositMoney)


module.exports = router