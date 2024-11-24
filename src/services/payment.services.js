const mongoose = require("mongoose");
const AppError = require("../helpers/handleError");
const walletService = require("../services/wallet.services");
const transactionService = require("../services/transaction.services");
const webhookService = require("../services/webhook.services");
const voucherService = require("../services/voucher.services");
const { PartnerServices } = require("./partner.services");
const bcrypt = require("../utils/bcrypt");
const { signature } = require("../utils/crypto-js");
const { verifySecurityCode } = require("../services/security.services");
const WEBHOOK_EVENT = require("../contains/webhook-event");
const convertToObjectId = require("../utils/convert-type-object");
const ConnectWallet = require("../models/connect-wallet.model");
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
    if (!bcrypt.bcryptCompare(security_code, sender.security_code)) {
      throw new AppError("Mã bảo mật không đúng", 400);
    }
    const currencyID = transaction.currency._id;
    const { amount, voucherID } = await voucherService.applyVoucherPayment(
      transaction,
      session,
      voucher_code,
      currencyID
    );
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
    await webhookService.postWebhook(
      transaction?.partnerID._id,
      WEBHOOK_EVENT.PAYMENT_SUCCEEDED,
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
      transactionData.amount,
      transactionData.currency._id,
      voucher
    );
    return amount;
  },
  connectWallet: async ({ partnerID, user, security_code }) => {
    const partner = await PartnerServices.findPartner(
      convertToObjectId(partnerID)
    );
    await verifySecurityCode(security_code, user.security_code, 3, user);
    const signatureData = signature(partner.privateKey, user);
    await ConnectWallet.create({
      partnerID: convertToObjectId(partnerID),
      userID: user._id,
      signature: signatureData,
    });
    await webhookService.postWebhook(
      transaction?.partnerID._id,
      WEBHOOK_EVENT.CONNECT_WALLET,
      {
        status: 200,
        signatureData,
      }
    );
  },
  getPartnerConnect: async (partnerID) => {
    return await PartnerServices.findPartner(convertToObjectId(partnerID));
  },
};
