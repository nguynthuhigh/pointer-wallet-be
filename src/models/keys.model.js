const { Schema, model } = require("mongoose");

const keySchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    partnerID: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    adminID: {
      type: Schema.Types.ObjectId,
      ref: "Partner",
    },
    access_token: {
      type: String,
    },
    refresh_token: {
      type: String,
      index: true,
    },
    refresh_token_used: [
      {
        type: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: 60 * 60 * 24 * 14 },
    },
  },
  {
    timestamps: true,
  }
);
const Key = model("key", keySchema);
module.exports = Key;
