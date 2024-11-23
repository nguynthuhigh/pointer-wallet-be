const express = require("express");
const router = express.Router();
const controller = require("../../controllers/payment/payment.controller");
const {
  authenticationUser,
} = require("../../middlewares/authentication.middleware");
router.use(authenticationUser);
router
  .post("/confirm-payment", controller.confirmPayment)
  .post("/apply-voucher", controller.applyVoucher)
  .post("/connect-wallet", controller.connectWallet);

module.exports = router;
