const express = require('express')
const router = express.Router()
const roleAuth = require('../middlewares/role.middleware')
const ROLE = require('../utils/role')
const controller = require('../controller/wallet.controller')

// router.get('/getusers',roleAuth.verifyRole(ROLE.ADMIN),controller.getUsers)
// router.put('/ban/user',roleAuth.verifyRole(ROLE.ADMIN),controller.banUser)

//user
router.post('/send-money',roleAuth.Authenciation(ROLE.USER),controller.sendMoney)
router.post('/send-money/verify',roleAuth.Authenciation(ROLE.USER),controller.verifyTransaction)
router.get('/get-wallet',roleAuth.Authenciation(ROLE.USER),controller.getWallet)
router.post('/deposit-money',roleAuth.Authenciation(ROLE.USER),controller.depositMoney)
router.post('/deposit-money/verify',roleAuth.Authenciation(ROLE.USER),controller.verifyDepositMoney)



//admin
router.post('/post/currency',controller.addCurrency)
router.get('/get/currency',controller.getCurrency)
router.get('/get/currency',controller.getCurrency)




module.exports = router