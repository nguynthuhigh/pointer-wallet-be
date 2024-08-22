const controller = require('../../controllers/user/transaction.controller')
const express = require('express')
const router = express.Router()
const roleAuth = require('../../middlewares/role.middleware')
const ROLE = require('../../utils/role')
const {authenticationUser} = require('../../middlewares/authentication.middleware')
router.get('/get/transactions',roleAuth.Authenciation(ROLE.USER),controller.getTransactionPaginate)
router.get('/get/transaction/details/:id',authenticationUser,controller.getTransactionDetails)
module.exports = router