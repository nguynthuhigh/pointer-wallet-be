const AppError = require("../helpers/handleError");
const { Webhook } = require("../models/webhook.model");
const convertToObjectId = require("../utils/convert-type-object");
const webhookAPI = require("../utils/webhook.call.api");
const getWebhookEndpoints = async (partnerID) => {
  const data = await Webhook.find({
    partner: partnerID,
  });
  return data;
};
const getWebhookPartner = async (partnerID, event) => {
  const data = await Webhook.findOne({
    partner: convertToObjectId(partnerID),
    event,
  });
  if (!data) {
    throw new AppError("Event not found!");
  }
  return data;
};
const addWebhookEndpoint = async (endpoint, partnerID, event) => {
  const webhook = await Webhook.findOne({
    partner: partnerID,
    event,
  });
  if (!webhook) {
    const data = await Webhook.create({
      url: endpoint,
      partner: partnerID,
      event: event,
    });
    return data;
  }
  await webhook.updateOne({ url: endpoint });
};
const deleteWebhook = async (_id, partner) => {
  const webhook = await Webhook.findById(convertToObjectId(_id));
  if (!webhook || webhook.partner.toString() !== partner.toString()) {
    throw new AppError("Webhook not found");
  }
  await webhook.deleteOne();
};
const postWebhook = async (partnerID, event, payload, session) => {
  const webhook = await getWebhookPartner(partnerID, event);
  await webhookAPI.postWebhookPayment(webhook.url, payload, session);
};
module.exports = {
  getWebhookEndpoints,
  getWebhookPartner,
  deleteWebhook,
  addWebhookEndpoint,
  deleteWebhook,
  postWebhook,
};
