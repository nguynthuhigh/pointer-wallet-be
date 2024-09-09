const AppError = require("../helpers/handleError");
const { CreditCard } = require("../models/creditcard.model")

const findCardById = (id)=>{
    const cardData = CreditCard.findById(id);
    if(!cardData){
        throw new AppError("Thẻ không tồn tại",404)
    }
    return cardData
}
const deleteCard =async (id,userID)=>{
    const data = await CreditCard.deleteOne({_id:id,userID:userID})
    if(data.deletedCount != 1){
        throw new AppError("Không thể xóa thẻ, vui lòng thử lại",400)
    }
}
const findCardAndUpdate =async (id,body)=>{
    const data = await CreditCard.updateOne({_id:id},body)
    if(data.modifiedCount !== 1){
        throw new AppError("Không thể sửa thẻ",400)
    }
}
const getCards = async(id)=>{
    const data = await CreditCard.find({userID:id})
    return data
}
const checkCardExists = async (number,userID)=>{
    const data = await CreditCard.findOne({number:number,userID:userID})
    if(data){
        throw new AppError("Thẻ đã tồn tại",400)
    }
}
const createCard = async(body)=>{
    await checkCardExists(body.number,body.userID)
    const data = await CreditCard.create(body)
    if(!data){
        throw new AppError("Tạo thẻ thất bại",400)
    }
    return data
}
module.exports = {
    findCardById,
    deleteCard,
    findCardAndUpdate,
    getCards,
    createCard
}