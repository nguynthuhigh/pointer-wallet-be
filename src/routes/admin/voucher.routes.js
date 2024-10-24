const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/voucher.controller");
router.get("/get-vouchers", controller.getVouchers);
router.get("/voucher-details/:id", controller.getVoucherDetails);

module.exports = router;
