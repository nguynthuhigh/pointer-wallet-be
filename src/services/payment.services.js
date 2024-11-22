const mongoose = require("mongoose");
const AppError = require("../helpers/handleError");
const walletService = require("../services/wallet.services");
const transactionService = require("../services/transaction.services");
const webhookService = require("../services/webhook.services");
const voucherService = require("../services/voucher.services");
const webhookAPI = require("../utils/webhook.call.api");
const bcrypt = require("../utils/bcrypt");
const WEBHOOK_EVENT = require("../contains/webhook-event");
module.exports = {
  confirmPayment: async ({
    sender,
    security_code,
    transactionID,
    voucher_code,
  }) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const transaction = await transactionService.getTransactionForPayment(
      transactionID
    );
    if (!transaction || transaction.status === "completed") {
      throw new AppError("Không tìm thấy giao dịch", 404);
    }
    console.log(sender);
    if (!bcrypt.bcryptCompare(security_code, sender.security_code)) {
      throw new AppError("Mã bảo mật không đúng", 400);
    }
    let amount = transaction.amount;
    const currencyID = transaction.currency._id;
    const resultApply = await voucherService.applyVoucherPayment(
      transaction,
      session,
      voucher_code,
      currencyID
    );
    amount = resultApply?.amount || amount;
    const voucherID = resultApply?.voucherID;
    await walletService.hasSufficientBalance(sender, currencyID, amount);
    await walletService.updateBalance(sender, currencyID, -amount, session);
    await walletService.updateBalancePartner(
      transaction.partnerID,
      currencyID,
      amount,
      session
    );
    const transactionData = await transactionService.updateCompletedPayment(
      amount,
      voucherID,
      sender,
      transactionID,
      session
    );
    const webhook = await webhookService.getWebhookPartner(
      transaction?.partnerID._id,
      WEBHOOK_EVENT.PAYMENT_SUCCEEDED
    );
    await webhookAPI.postWebhookPayment(
      webhook.url,
      {
        status: 200,
        orderID: transaction.orderID,
      },
      session
    );
    await session.commitTransaction();
    session.endSession();
    return transactionData;
  },
  applyVoucher: async ({ code, transactionID }) => {
    const voucher = await voucherService.getVoucherByCode(code);
    const transactionData = await transactionService.getTransactionForPayment(
      transactionID
    );
    await voucherService.checkOwnVoucher(
      transactionData.partnerID._id,
      voucher.partnerID
    );
    const amount = voucherService.applyVoucher(
      voucher.type,
      transactionData.amount,
      voucher.discountValue,
      voucher.quantity,
      transactionData.currency._id,
      voucher.currency
    );
    return amount;
  },
};
