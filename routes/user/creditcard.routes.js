const express = require('express')
const router = express.Router()
const controller = require('../../controllers/user/creditcard.controller')

const {authenticationUser} = require('../../middlewares/authentication.middleware')
router.post('/add-card',authenticationUser,controller.addCard)
router.get('/get-cards',authenticationUser,controller.getCardS)
router.get('/details/:id',authenticationUser,controller.getCardDetails)
router.put('/edit-card/:id',authenticationUser,controller.editCard)
router.delete('/delete-card/:id',authenticationUser,controller.deleteCard)



module.exports = router