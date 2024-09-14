const express = require('express')
const router = express.Router()
const controller = require('../../controllers/user/user.controller')
const {authenticationUser} = require('../../middlewares/authentication.middleware')

router.get('/profile',authenticationUser,controller.getProfile)

module.exports = router