const AppError = require("../helpers/handleError");
const { Voucher } = require("../models/voucher.model");
const convertToObjectId = require("../utils/convertTypeObject");
const applyVoucher = (
  type,
  amount,
  discountValue,
  quantity,
  transactionCurrency,
  voucherCurrency
) => {
  if (transactionCurrency.toString() !== voucherCurrency.toString()) {
    throw new AppError("Voucher không hỗ trợ loại tiền tệ này", 402);
  }
  let result;
  if (quantity <= 0) {
    throw new AppError("Voucher đã hết lượt sử dụng", 400);
  }
  switch (type) {
    case "discount_amount": {
      result = amount - discountValue;
      if (result < 0) return 0;
    }
    case "discount_percent": {
      result = amount - amount * (discountValue / 100);
      return result;
    }
    default:
      throw new AppError("Không thể áp dụng voucher vui lòng thử lại", 500);
  }
};
const updateQuantityVoucher = async (id, session) => {
  const data = Voucher.updateOne(
    { _id: id },
    { $inc: { quantity: -1, usedCount: 1 } },
    { session }
  );
  if (data.modifiedCount === 0) {
    throw new AppError("Voucher đã hết vui lòng thử lại", 400);
  }
};
const applyVoucherPayment = async (
  transactionDataTemp,
  session,
  voucher_code,
  currencyID
) => {
  if (!voucher_code) {
    return;
  }
  const getVoucher = await Voucher.findOne({ code: voucher_code }).lean();
  if (!getVoucher && getVoucher.quantity <= 0) {
    throw new AppError("Voucher đã hết", 400);
  }
  const result_apply = applyVoucher(
    getVoucher.type,
    transactionDataTemp.amount,
    getVoucher.discountValue,
    getVoucher.quantity,
    currencyID,
    getVoucher.currency
  );
  await updateQuantityVoucher(getVoucher._id, session);
  const data = {
    voucherID: getVoucher._id,
    amount: result_apply,
  };
  return data;
};
const getVouchersOfPartner = async (partnerID) => {
  const data = await Voucher.find({
    partnerID: convertToObjectId(partnerID),
  }).lean();
  return data;
};
const checkOwnVoucher = async (partnerID, voucher_PartnerID) => {
  if (partnerID.toString() !== voucher_PartnerID.toString()) {
    throw new AppError("Voucher không hợp lệ với giao dịch này", 400);
  }
};
const getVoucherByCode = async (code) => {
  const data = await Voucher.findOne({ code: code }).lean();
  if (!data) {
    throw new AppError("Voucher không tồn tại", 404);
  }
  return data;
};
const hasVoucherByCode = async (code) => {
  const data = await Voucher.findOne({ code: code }).lean();
  if (data) {
    throw new AppError("Voucher code already exists", 400);
  }
  return data;
};
const addVoucher = async (body) => {
  return await Voucher.create(body);
};
const editVoucher = async (voucherID, body) => {
  const data = await Voucher.findByIdAndUpdate(voucherID, body);
  return data;
};
const deleteVoucher = async (voucherID) => {
  const data = await Voucher.findByIdAndDelete(voucherID);
  return data;
};
const getDetailsVoucher = async (voucherID) => {
  const data = await Voucher.findById(voucherID).lean();
  return data;
};
module.exports = {
  getVoucherByCode,
  hasVoucherByCode,
  checkOwnVoucher,
  getVouchersOfPartner,
  applyVoucher,
  updateQuantityVoucher,
  applyVoucherPayment,
  addVoucher,
  editVoucher,
  deleteVoucher,
  getDetailsVoucher,
};
