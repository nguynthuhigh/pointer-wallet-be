const express = require('express')
const router = express.Router()
const controller = require('../../controllers/user/transaction.controller')
const {authenticationUser} = require('../../middlewares/authentication.middleware')

router.get('/get/transactions',authenticationUser,controller.getTransactionPaginate)
router.get('/get/transaction/details/:id',authenticationUser,controller.getTransactionDetails)
module.exports = router