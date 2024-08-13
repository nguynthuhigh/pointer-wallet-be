const express = require('express')
const router = express.Router()
const roleAuth = require('../../middlewares/role.middleware')
const ROLE = require('../../utils/role')
const controller = require('../../controllers/partner/webhook.controller')

router.post('/add-endpoint',roleAuth.Authenciation(ROLE.PARTNER),controller.addWebhookEndpoint)
router.delete('/delete-endpoint',roleAuth.Authenciation(ROLE.PARTNER),controller.deleteWebhookEndpoint)
router.post('/test-endpoint',roleAuth.Authenciation(ROLE.PARTNER),controller.testEndpoint)


module.exports = router