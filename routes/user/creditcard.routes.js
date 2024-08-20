const express = require('express')
const router = express.Router()
const creditcard = require('../../controllers/user/creditcard.controller')
const authUser = require('../../middlewares/role.middleware')
const ROLE = require('../../utils/role')
router.post('/add-card',authUser.Authenciation(ROLE.USER),creditcard.addCard)
router.get('/get-cards',authUser.Authenciation(ROLE.USER),creditcard.getCardS)
router.get('/details/:id',authUser.Authenciation(ROLE.USER),creditcard.getCardDetails)
router.put('/edit-card/:id',authUser.Authenciation(ROLE.USER),creditcard.editCard)
router.delete('/delete-card/:id',authUser.Authenciation(ROLE.USER),creditcard.deleteCard)



module.exports = router