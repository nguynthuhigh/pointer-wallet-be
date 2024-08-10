const express = require('express')
const router = express.Router()
const roleAuth = require('../../middlewares/role.middleware')
const ROLE = require('../../utils/role')
const controller = require('../../controllers/admin/user_management.controller')
const upload = require('../../middlewares/multer.middleware')
const serviceTask = require('../../cron/task/calculate_statistic.task')
router.get('/get',async(req,res)=>{
    await serviceTask.statisticalCalculations()
    res.json('ok')
})

module.exports = router
