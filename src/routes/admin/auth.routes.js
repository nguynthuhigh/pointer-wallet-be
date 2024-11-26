const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/auth.controller");
const {
  authenticationAdmin,
} = require("../../middlewares/authentication.middleware");
router
  .post("/sign-in", controller.loginAdmin)
  .post("/add", authenticationAdmin, controller.createAdmin)
  .get("/get-admin", authenticationAdmin, controller.getAdmin)
  .delete("/delete-admin/:id", authenticationAdmin, controller.deleteAdmin);

module.exports = router;
