const AppError = require("../helpers/handleError");
const { CreditCard } = require("../models/creditcard.model")

const findCardById = (id)=>{
    const cardData = CreditCard.findById(id);
    if(!cardData){
        throw new AppError("Thẻ không tồn tại",404)
    }
    return cardData
}

module.exports = {
    findCardById
}