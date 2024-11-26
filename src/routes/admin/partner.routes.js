const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/partner.controller");
const {
  authenticationAdmin,
} = require("../../middlewares/authentication.middleware");

//Analyst
router.use(authenticationAdmin);
router.get("/get-partners", controller.getPartners);
router.get("/get-details", controller.getPartnerDetails);
router.get("/get-transactions", controller.getPartnerTransactions);
router.post("/ban-partner", controller.banPartner);

module.exports = router;
