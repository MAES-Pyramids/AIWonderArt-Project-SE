const express = require("express");
const dotenv = require("dotenv");
const dalleController = require("./../controllers/dalleController");
//-------------------Router------------------//
const router = express.Router();
router
  .route("/")
  .get(dalleController.getRequest)
  .post(dalleController.postRequest);
//-------------------------------------------//
module.exports = router;
