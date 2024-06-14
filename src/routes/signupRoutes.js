const express = require('express');
const router = express.Router();
const signupController = require('../controllers/signupController');

router.route('/signup').post(signupController.signupUser);

module.exports = router;
