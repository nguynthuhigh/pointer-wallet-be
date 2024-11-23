const { Schema, model } = require("mongoose");
const WEBHOOK_EVENT = require("../contains/webhook-event");
const webhookSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    event: {
      type: String,
      enum: Object.values(WEBHOOK_EVENT),
      required: true,
    },
    partner: {
      type: Schema.Types.ObjectId,
      ref: "Partner",
      require: true,
    },
  },
  {
    timestamps: true,
  }
);
const Webhook = model("Webhook", webhookSchema);
module.exports = { Webhook };
