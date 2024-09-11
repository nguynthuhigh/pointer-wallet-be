const {CreditCard} = require('../../models/creditcard.model')
const cryptoJS = require('../../utils/crypto-js')
const ccType = require('../../utils/cctype')
const {Response} = require('../../utils/response')
const catchError = require('../../middlewares/catchError.middleware')
const cardServices = require('../../services/credit_card.services')
const AppError = require('../../helpers/handleError')
const convertToObjectId = require('../../utils/convertTypeObject')
module.exports = {
    addCard: catchError(async (req,res,next)=>{
        const userID = req.user
        const typeCard = ccType.getCardType(req.body.number.replace(/\s+/g, ''))
        if(!typeCard) {
            throw new AppError('Thẻ không hợp lệ',402)
        }
        const body = {
            ...req.body,
            userID:userID,
            type:typeCard
        }
        await cardServices.createCard(body);
        return Response(res,"Thêm thẻ thành công",null,200)
    }),
    getCardS:catchError(async(req,res,next)=>{
        const userID = req.user
        const card = await cardServices.getCards(userID)
            let list_card = []
            card.forEach(element => {
                const decrypt = {
                        _id: element._id,
                        number: element.number.substring(0,4) + '*'.repeat(element.number.length-8) + element.number.substring(element.number.length-4,element.number.length),
                        name:element.name,
                        type:element.type
                    }
                list_card.push(decrypt)
            }); 
        return Response(res,"Success",list_card,200)
    }),
    getCardDetails: catchError(async (req, res) => {
        const id = req.params.id;
        const card = await cardServices.findCardById(id,req.user)
        const cardDecrypt = {
            name: cryptoJS.decrypt(card.name),
            number: card.number.substring(0,4) + '*'.repeat(card.number.length-8) + card.number.substring(card.number.length-4,card.number.length),
            expiryMonth: cryptoJS.decrypt(card.expiryMonth),
            expiryYear: cryptoJS.decrypt(card.expiryYear),
            type:card.type
        }
        return Response(res,"Success",cardDecrypt,200)
 
    }),
    editCard:catchError(async (req,res)=>{
        const id = req.params.id
        await cardServices.findCardAndUpdate(id,req.body)
        return Response(res,"Sửa thông tin thẻ thành công",null,200)
    }),
    deleteCard: catchError(async (req,res)=>{
        const id = req.params.id
        await cardServices.deleteCard(convertToObjectId(id),req.user) 
        return Response(res,"Xóa thẻ thành công",null,200)
    })
}