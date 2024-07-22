const express = require('express')
const router = express.Router()
const creditcard = require('../controller/creditcard.controller')
const authUser = require('../middlewares/role.middleware')
const ROLE = require('../utils/role')
router.post('/addcard',authUser.Authenciation(ROLE.USER),creditcard.addcard)
router.get('/getcards/',authUser.Authenciation(ROLE.USER),creditcard.getCardS)
router.get('/details/:id',authUser.Authenciation(ROLE.USER),creditcard.getCardDetails)
router.put('/editcard',authUser.Authenciation(ROLE.USER),creditcard.editCard)
router.delete('/deletecard/:id',authUser.Authenciation(ROLE.USER),creditcard.deleteCard)



module.exports = router