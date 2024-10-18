const webhookServices = require("../../services/webhook.services");
const { Response } = require("../../utils/response");
const webhook = require("../../utils/webhook.call.api");
module.exports = {
  addWebhookEndpoint: async (req, res) => {
    try {
      const { endpoint } = req.body;
      const partnerID = req.partner;
      if (await webhookServices.checkWebhook(partnerID)) {
        return Response(res, "Only one webhook per partner", null, 400);
      }
      const data = await webhookServices.addWebhookEndpoint(
        endpoint,
        partnerID
      );
      Response(res, "Added", data, 200);
    } catch (error) {
      console.log(error);
      Response(res, "Error, Please try again", null, 400);
    }
  },
  deleteWebhookEndpoint: async (req, res) => {
    try {
      const partnerID = req.partner;
      const data = await webhookServices.deleteWebhook(partnerID);
      Response(res, "Deleted", data, 200);
    } catch (error) {
      console.log(error);
      Response(res, "Error, Please try again", null, 400);
    }
  },
  testEndpoint: async (req, res) => {
    try {
      const endpoint = req.partner.webhook;
      const { orderID, status } = req.body;
      const response = await webhook.postWebhook(endpoint, { orderID, status });
      if (response.status === 200) {
        return Response(res, "It's working", response.data, 200);
      }
      return Response(res, "It's not working", null, 400);
    } catch (error) {
      console.log(error);
      Response(res, "Error system", error, 500);
    }
  },
};
