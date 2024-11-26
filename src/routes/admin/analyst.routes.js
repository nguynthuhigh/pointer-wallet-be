const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/analyst.controller");
const {
  authenticationAdmin,
} = require("../../middlewares/authentication.middleware");

//Analyst
router.use(authenticationAdmin);
router
  .get("/get-total-dashboard", controller.getTotalDashBoard)
  .get("/get-type-transaction-analyst", controller.getTypeTransactionAnalyst)
  .get(
    "/get-status-transaction-analyst",
    controller.getStatusTransactionAnalyst
  )
  .get("/get-this-week-analyst", controller.getThisWeek)
  .get("/get-this-month-analyst", controller.getThisMonth)
  .get("/get-customer-analyst", controller.getCustomerAnalyst)
  .get("/get-partner-analyst", controller.getPartnerAnalyst)
  .get("/get-transaction-analyst", controller.getTransactionAnalyst)
  .get("/get-total-money-type", controller.getTotalMoneyType)
  .get("/get-transactions-1d", controller.getTransaction1D)
  .get("/get-transactions-1w", controller.getTransaction1W)
  .get("/get-transactions-1m", controller.getTransaction1M);

module.exports = router;
