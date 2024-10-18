const express = require("express");
const router = express.Router();
const serviceTask = require("../../cron/task/calculate_statistic.task");
router.get("/get", serviceTask.statisticalCalculations);

module.exports = router;
