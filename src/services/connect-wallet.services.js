const AppError = require("../helpers/handleError");
const ConnectWallet = require("../models/connect-wallet.model");
const convertToObjectId = require("../utils/convert-type-object");

const createConnect = async (partner, userID, signature, session) => {
  const connected = await ConnectWallet.findOne({ signature });
  if (connected) {
    session.abortTransaction();
    throw new AppError(`Bạn đã kết nối ví với ${partner.name}`, 400);
  }
  const connect = new ConnectWallet({
    partnerID: partner._id,
    userID,
    signature,
  });
  await connect.save({ session });
};
const getConnectApps = async (userID) => {
  return await ConnectWallet.find({
    userID: convertToObjectId(userID),
  })
    .populate({
      path: "partnerID",
      select: "name image description",
    })
    .select({ signature: 0 });
};
const disconnectApp = async (partnerID, userID) => {
  const disconnected = await ConnectWallet.deleteOne({
    partnerID: convertToObjectId(partnerID),
    userID,
  });
  if (disconnected.deletedCount !== 1) {
    throw new AppError("Hủy liên kết thất bại", 400);
  }
};
module.exports = {
  createConnect,
  getConnectApps,
  disconnectApp,
};
