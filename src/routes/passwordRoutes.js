const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');
router.route('/passwordChange').patch(passwordController.passwordChange);
module.exports = router;