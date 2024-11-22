const { Response } = require("../../utils/response");
const voucherServices = require("../../services/voucher.services");
const transactionServices = require("../../services/transaction.services");
const catchError = require("../../middlewares/catchError.middleware");
const PaymentService = require("../../services/payment.services");
module.exports = {
  confirmPayment: catchError(async (req, res) => {
    const data = await PaymentService.confirmPayment({
      ...req.body,
      sender: req.user_info,
    });
    return Response(res, "Thanh toán thành công", data, 200);
  }),

  applyVoucher: catchError(async (req, res) => {
    const data = await PaymentService.applyVoucher({
      ...req.body,
    });
    return Response(res, "Áp dụng voucher thành công", data, 200);
  }),
};
