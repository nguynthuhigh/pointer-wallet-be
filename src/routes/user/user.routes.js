const express = require("express");
const router = express.Router();
const controller = require("../../controllers/user/user.controller");
const {
  authenticationUser,
} = require("../../middlewares/authentication.middleware");
const { cache } = require("../../middlewares/cache.middleware");

router.get("/profile", authenticationUser, cache, controller.getProfile);

module.exports = router;
