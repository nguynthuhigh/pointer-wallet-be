const { Schema, model } = require("mongoose");

const partnerSchema = new Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      default: "../assets/img.png",
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email already exists"],
    },
    password: {
      type: String,
    },
    privateKey: {
      type: String,
    },
    publicKey: {
      type: String,
    },
    inactive: {
      type: Boolean,
      default: false,
    },
    webhook: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Partner = model("Partner", partnerSchema);
module.exports = { Partner };
