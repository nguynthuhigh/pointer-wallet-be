const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/transaction.controller')
router.get('/get-transactions',controller.getTransactions)
router.get('/get-transaction/details',controller.getTransactionDetails)
module.exports = router