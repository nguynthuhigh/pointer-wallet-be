const express = require('express')
const router = express.Router()
const roleAuth = require('../../middlewares/role.middleware')
const ROLE = require('../../utils/role')
const controller = require('../../controllers/partner/partner.controller')
const upload = require('../../middlewares/multer.middleware')

router.get('/dashboard',roleAuth.Authenciation(ROLE.PARTNER),controller.getDashboard)
router.put('/update-profile',upload.single('image'),roleAuth.Authenciation(ROLE.PARTNER),controller.updateInfo)
router.get('/get-transactions',roleAuth.Authenciation(ROLE.PARTNER),controller.getTransactions)
module.exports = router

