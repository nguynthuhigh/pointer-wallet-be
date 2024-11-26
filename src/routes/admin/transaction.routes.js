const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/transaction.controller");
const {
  authenticationAdmin,
} = require("../../middlewares/authentication.middleware");

router.use(authenticationAdmin);
router.get("/get-transactions", controller.getTransactions);
router.get("/get-transaction/details", controller.getTransactionDetails);
module.exports = router;
