const express = require('express')
const router = express.Router()
const roleAuth = require('../middlewares/role.middleware')
const ROLE = require('../utils/role')
const controller = require('../controllers/webhook.controller')

router.post('/add-webhook',roleAuth.Authenciation(ROLE.PARTNER),controller.addWebhookEndpoint)
router.delete('/delete-webhook',roleAuth.Authenciation(ROLE.PARTNER),controller.deleteWebhookEndpoint)


module.exports = router