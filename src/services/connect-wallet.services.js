const AppError = require("../helpers/handleError");
const ConnectWallet = require("../models/connect-wallet.model");

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
module.exports = {
  createConnect,
};
