const express = require('express')
const router = express.Router()
const roleAuth = require('../../middlewares/role.middleware')
const ROLE = require('../../contains/role')
const controller = require('../../controllers/admin/user_management.controller')
const upload = require('../../middlewares/multer.middleware')
const serviceTask = require('../../cron/task/calculate_statistic.task')
router.get('/get',serviceTask.statisticalCalculations)

module.exports = router
