const { Response } = require("../../utils/response");
const ConnectWalletService = require("../../services/connect-wallet.services");
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
  connectWallet: catchError(async (req, res) => {
    await PaymentService.connectWallet({
      ...req.body,
      user: req.user_info,
    });
    return Response(res, "Liên kết ví thành công", null, 200);
  }),
  getPartnerConnect: catchError(async (req, res) => {
    const data = await PaymentService.getPartnerConnect(req.params.id);
    return Response(res, "Success", data, 200);
  }),
  getConnectApps: catchError(async (req, res) => {
    const data = await ConnectWalletService.getConnectApps(req.user_info._id);
    return Response(res, "Success", data, 200);
  }),
  disconnectApp: catchError(async (req, res) => {
    const data = await ConnectWalletService.disconnectApp(
      req.params.id,
      req.user_info._id
    );
    return Response(res, "Hủy liên kết thành công", data, 200);
  }),
};
