const express = require('express')

const router = express.Router()
const controller = require('../../controllers/admin/partner_management.controller')
const middleware = require('../../middlewares/role.middleware')
const ROLE = require('../../contains/role')
router.get('/get-partners',middleware.Authentication_Admin(ROLE.ADMIN),controller.getPartners)
router.get('/details-partner',middleware.Authentication_Admin(ROLE.ADMIN),controller.getDetailsPartner)
router.get('/get-transactions',middleware.Authentication_Admin(ROLE.ADMIN),controller.getTransactionsPartner)



module.exports = router