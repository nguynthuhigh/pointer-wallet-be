const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    full_name: {
      type: String,
    },
    avatar: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Tài khoản đã tồn tại"],
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    security_code: {
      type: String,
    },
    inactive: {
      type: Boolean,
      required: true,
      default: false,
    },
    role: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const User = model("User", userSchema);
module.exports = { User };
