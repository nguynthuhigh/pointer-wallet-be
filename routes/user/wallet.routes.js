const express = require('express')
const router = express.Router()
const roleAuth = require('../../middlewares/role.middleware')
const ROLE = require('../../utils/role')
const controller = require('../../controllers/user/wallet.controller')

router.post('/send-money',roleAuth.Authenciation(ROLE.USER),controller.sendMoney)
router.post('/deposit-money',roleAuth.Authenciation(ROLE.USER),controller.depositMoney)


module.exports = router