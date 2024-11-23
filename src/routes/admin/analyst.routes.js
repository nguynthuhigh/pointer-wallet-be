const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/analyst.controller");

//Analyst 
router.get('/get-total-dashboard',controller.getTotalDashBoard);

router.get('/get-type-transaction-analyst',controller.getTypeTransactionAnalyst);
router.get('/get-status-transaction-analyst',controller.getStatusTransactionAnalyst);

router.get('/get-this-week-analyst',controller.getThisWeek);
router.get('/get-this-month-analyst',controller.getThisMonth);

router.get('/get-customer-analyst',controller.getCustomerAnalyst);
router.get('/get-partner-analyst',controller.getPartnerAnalyst);
router.get('/get-transaction-analyst',controller.getTransactionAnalyst);

router.get('/get-total-money-type',controller.getTotalMoneyType);

router.get('/get-transactions-1d',controller.getTransaction1D);
router.get('/get-transactions-1w',controller.getTransaction1W);
router.get('/get-transactions-1m',controller.getTransaction1M);

module.exports = router;