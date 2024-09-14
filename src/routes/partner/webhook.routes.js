const express = require('express')
const router = express.Router()
const controller = require('../../controllers/partner/webhook.controller')
const { authenticationPartner } = require('../../middlewares/authentication.middleware')

router.post('/add-endpoint',authenticationPartner,controller.addWebhookEndpoint)
router.delete('/delete-endpoint',authenticationPartner,controller.deleteWebhookEndpoint)
router.post('/test-endpoint',authenticationPartner,controller.testEndpoint)


module.exports = router