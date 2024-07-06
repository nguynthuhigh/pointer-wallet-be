const express = require('express')
const router = express.Router()
const roleAuth = require('../middlewares/role.middleware')
const ROLE = require('../utils/role')
const controller = require('../controller/partner/partner.controller')

router.get('/dashboard',roleAuth.Authenciation(ROLE.PARTNER),controller.getDashboard)
router.put('/update-profile',roleAuth.Authenciation(ROLE.PARTNER),controller.updateInfo)

module.exports = router

