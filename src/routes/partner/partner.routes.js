const express = require('express')
const router = express.Router()
const {authenticationPartner} = require('../../middlewares/authentication.middleware')
const controller = require('../../controllers/partner/partner.controller')
const upload = require('../../middlewares/multer.middleware')

router.get('/dashboard',authenticationPartner,controller.getDashboard)
router.post('/edit-profile',upload.single('image'),authenticationPartner,controller.editProfile)
router.get('/get-transactions',authenticationPartner,controller.getTransactions)
module.exports = router

