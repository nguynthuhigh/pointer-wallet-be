const express = require('express')
const router = express.Router()
const creditcard = require('../controller/creditcard.controller')
const authUser = require('../middlewares/role.middleware')
const ROLE = require('../utils/role')
router.post('/addcard',creditcard.addcard)
router.get('/getcards/',authUser.Authenciation(ROLE.USER),creditcard.getCardS)
router.get('/details/:id',creditcard.getCardDetails)
router.put('/editcard',creditcard.editCard)
router.delete('/deletecard/:id',creditcard.deleteCard)



module.exports = router