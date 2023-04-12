const express = require("express");
const dotenv = require("dotenv");

const Post = require("./../models/post");
const postController = require("./../controllers/postController");
//-------------------Router------------------//
const router = express.Router();
router
  .route("/")
  .get(postController.getRequest)
  .post(postController.postRequest);
//-------------------------------------------//
module.exports = router;
