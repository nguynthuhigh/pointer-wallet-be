const express = require("express");
const router = express.Router();
const controller = require("../../controllers/partner/webhook.controller");
const {
  authenticationPartner,
} = require("../../middlewares/authentication.middleware");
router.use(authenticationPartner);
router
  .post("/add-endpoint", controller.addWebhookEndpoint)
  .delete("/delete-endpoint/:id", controller.deleteWebhookEndpoint)
  .get("", controller.getWebhookEndpoints);

module.exports = router;
