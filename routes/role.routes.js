const controller = require('../controller/role.controller')
const express = require('express')
const router = express.Router()
const roleAuth = require('../middlewares/role.middleware')
const ROLE = require('../utils/role')

router.put('/admin',roleAuth.verifyRole(ROLE.ADMIN),controller.putRoleAdmin)
router.put('/marketing',roleAuth.verifyRole(ROLE.ADMIN),controller.putRoleMarketing)
router.put('/finance',roleAuth.verifyRole(ROLE.ADMIN),controller.putRoleFinance)
router.put('/support',roleAuth.verifyRole(ROLE.ADMIN),controller.putRoleSupport)
router.post('/listSupport',controller.getList)

module.exports = router