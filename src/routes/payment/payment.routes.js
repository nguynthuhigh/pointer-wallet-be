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
  .post("/connect-wallet", controller.connectWallet)
  .get("/connected-app", controller.getConnectApps)
  .get("/partner/:id", controller.getPartnerConnect)
  .delete("/disconnect-wallet/:id", controller.disconnectApp);

module.exports = router;
