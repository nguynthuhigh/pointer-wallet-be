const express = require('express')
const router = express.Router()
const roleAuth = require('../middlewares/role.middleware')
const ROLE = require('../utils/role')
const controller = require('../controller/partner/partner.controller')

router.get('/get-info',roleAuth.Authenciation(ROLE.PARTNER),controller.getInfo)

module.exports = router