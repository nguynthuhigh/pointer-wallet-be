const AppError = require("../helpers/handleError");
const { CreditCard } = require("../models/creditcard.model");
const convertToObjectId = require("../utils/convertTypeObject");

const findCardById = async (id, userID) => {
  const cardData = await CreditCard.findOne({
    _id: convertToObjectId(id),
    userID: userID,
  });
  if (!cardData) {
    throw new AppError("Thẻ không tồn tại", 404);
  }
  return cardData;
};
const deleteCard = async (id, userID) => {
  const data = await CreditCard.deleteOne({ _id: id, userID: userID });
  if (data.deletedCount != 1) {
    throw new AppError("Không thể xóa thẻ, vui lòng thử lại", 400);
  }
};
const findCardAndUpdate = async (id, body) => {
  const data = await CreditCard.updateOne({ _id: id }, body);
  if (data.modifiedCount !== 1) {
    throw new AppError("Không thể sửa thẻ", 400);
  }
};
const getCards = async (id) => {
  const data = await CreditCard.find({ userID: id });
  return data;
};
const checkCardExists = async (number, userID) => {
  const data = await CreditCard.findOne({ number: number, userID: userID });
  if (data) {
    throw new AppError("Thẻ đã tồn tại", 400);
  }
};
const addCard = async (body) => {
  const userID = body.userID;
  await checkCardExists(body.number, userID);
  const name = body.user.full_name;
  const resultCompare = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ /g, "");
  if (resultCompare !== body.name.toLowerCase().replace(/ /g, "")) {
    throw new AppError("Tên thẻ phải khớp với tên người dùng", 400);
  }
  const cardCount = await CreditCard.countDocuments({ userID: userID });
  if (cardCount > 3) {
    throw new AppError("Mỗi tài khoản chỉ được thêm tối đa 4 thẻ", 400);
  }
  const data = await CreditCard.create(body);
  if (!data) {
    throw new AppError("Tạo thẻ thất bại", 400);
  }
  return data;
};
module.exports = {
  findCardById,
  deleteCard,
  findCardAndUpdate,
  getCards,
  addCard,
};
