const express = require('express');
const dalleController = require('./../controllers/dalleController');
//-------------------Router------------------//
const router = express.Router();
router.route('/').post(dalleController.postRequest);
//-------------------------------------------//
module.exports = router;
