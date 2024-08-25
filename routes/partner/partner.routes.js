const express = require('express')
const router = express.Router()
const {authenticationPartner} = require('../../middlewares/authentication.middleware')
const controller = require('../../controllers/partner/partner.controller')
const upload = require('../../middlewares/multer.middleware')

router.get('/dashboard',authenticationPartner,controller.getDashboard)
router.put('/update-profile',upload.single('image'),authenticationPartner,controller.updateInfo)
router.get('/get-transactions',authenticationPartner,controller.getTransactions)
module.exports = router

