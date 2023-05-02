const express = require('express');
const authController = require('../controllers/authController');
const postController = require('./../controllers/postController');

//-------------------Router------------------//
const router = express.Router();
router
  .route('/')
  .get(authController.protect, postController.getRequest)
  .post(postController.postRequest);
//-------------------------------------------//
module.exports = router;
