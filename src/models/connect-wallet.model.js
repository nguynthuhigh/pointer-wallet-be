const { Schema, model } = require("mongoose");

const connectWalletSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    partnerID: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    signature: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);
const ConnectWallet = model("ConnectWallet", connectWalletSchema);
module.exports = ConnectWallet;