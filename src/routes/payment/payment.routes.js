const express = require("express");
const router = express.Router();
const controller = require("../../controllers/payment/payment.controller");
const {
  authenticationUser,
} = require("../../middlewares/authentication.middleware");
router.use(authenticationUser);
router
  .post("/api/v1/confirm-payment", controller.confirmPayment)
  .post("/api/v1/apply-voucher", controller.applyVoucher);

module.exports = router;
