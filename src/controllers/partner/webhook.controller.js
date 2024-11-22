const webhookServices = require("../../services/webhook.services");
const { Response } = require("../../utils/response");
const catchError = require("../../middlewares/catchError.middleware");

module.exports = {
  getWebhookEndpoints: catchError(async (req, res) => {
    const data = await webhookServices.getWebhookEndpoints(req.partner._id);
    return Response(res, null, data, 200);
  }),
  addWebhookEndpoint: catchError(async (req, res) => {
    const { url, event } = req.body;
    const data = await webhookServices.addWebhookEndpoint(
      url,
      req.partner._id,
      event
    );
    return Response(res, "Webhook added successfully!", data, 200);
  }),
  deleteWebhookEndpoint: catchError(async (req, res) => {
    const { id } = req.params;
    const data = await webhookServices.deleteWebhook(id, req.partner._id);
    return Response(res, "Webhook deleted successfully!", data, 200);
  }),
};
