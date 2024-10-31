const { Partner } = require("../models/partner.model");
const { del } = require("../helpers/redis.helpers");

module.exports = {
  addWebhookEndpoint: async (endpoint, partnerID) => {
    const data = Partner.findByIdAndUpdate(partnerID, { webhook: endpoint });
    await del(`partner:${partnerID._id}`);
    return data;
  },
  checkWebhook: async (partnerID) => {
    const partner = await Partner.findById(partnerID);
    if (partner.webhook === undefined) {
      return false;
    }
    return true;
  },
  deleteWebhook: async (partnerID) => {
    console.log(partnerID._id);
    const data = Partner.findByIdAndUpdate(partnerID, {
      $unset: { webhook: "" },
    });
    await del(`partner:${partnerID._id}`);
    return data;
  },
};
