const express = require('express');
const authController = require('../controllers/authController');
const postController = require('./../controllers/postController');

//-------------------Router------------------//
const router = express.Router();
router
  .route('/')
  .get(postController.getRequest)
  .post(authController.protect, postController.postRequest);
//-------------------------------------------//
module.exports = router;
