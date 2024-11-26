const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/user.controller");

const {
  authenticationAdmin,
} = require("../../middlewares/authentication.middleware");
router.get("/get-user", controller.getUser);
router.use(authenticationAdmin);
router.get("/get-users", controller.getUsers);
router.patch("/ban-user", controller.banUser);
router.get("/get-transactions", controller.getUserTransactions);
router.get("/get-details", controller.getUserDetails);
//user

module.exports = router;
