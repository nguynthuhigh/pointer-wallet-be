const express = require('express')
const router = express.Router()
const controller = require('../../controllers/payment/voucher.controller')
const validate = require('../../middlewares/validate.middleware')
const upload = require('../../middlewares/multer.middleware')
const { authenticationPartner } = require('../../middlewares/authentication.middleware')
router.post('/add-voucher',upload.single('image'),validate.validateAddVoucher,authenticationPartner,controller.addVoucher)
router.delete('/delete-voucher',authenticationPartner,controller.deleteVoucher)
router.put('/edit-voucher',validate.validateAddVoucher,authenticationPartner,controller.editVoucher)

router.get('/get-vouchers',authenticationPartner,controller.getVouchersPartner)
router.get('/get-voucher-details',authenticationPartner,controller.getVoucher)
router.get('/get-vouchers-partner',controller.getVouchersPayment)






//,authenticationPartner
module.exports = router