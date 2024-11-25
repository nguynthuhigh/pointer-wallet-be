const { Schema, model } = require("mongoose");

const connectWalletSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    partnerID: {
      type: Schema.Types.ObjectId,
      ref: "Partner",
    },
    signature: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);
const ConnectWallet = model("ConnectWallet", connectWalletSchema);
module.exports = ConnectWallet;
