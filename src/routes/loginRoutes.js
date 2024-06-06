const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginControllers');

router.route('/login').post(loginController.loginUser);

module.exports = router;
