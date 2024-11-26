const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/analyst.controller");
const {
  authenticationAdmin,
} = require("../../middlewares/authentication.middleware");

//Analyst
router
  .get("/get-total-dashboard",authenticationAdmin, controller.getTotalDashBoard)
  .get("/get-type-transaction-analyst",authenticationAdmin, controller.getTypeTransactionAnalyst)
  .get(
    "/get-status-transaction-analyst",authenticationAdmin,
    controller.getStatusTransactionAnalyst
  )
  .get("/get-this-week-analyst", authenticationAdmin,controller.getThisWeek)
  .get("/get-this-month-analyst", authenticationAdmin,controller.getThisMonth)
  .get("/get-customer-analyst",authenticationAdmin, controller.getCustomerAnalyst)
  .get("/get-partner-analyst", authenticationAdmin,controller.getPartnerAnalyst)
  .get("/get-transaction-analyst",authenticationAdmin, controller.getTransactionAnalyst)
  .get("/get-total-money-type",authenticationAdmin, controller.getTotalMoneyType)
  .get("/get-transactions-1d",authenticationAdmin, controller.getTransaction1D)
  .get("/get-transactions-1w",authenticationAdmin, controller.getTransaction1W)
  .get("/get-transactions-1m",authenticationAdmin, controller.getTransaction1M);

module.exports = router;
