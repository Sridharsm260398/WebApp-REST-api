const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
router.route('/creditdebit_post').post(paymentController.addCreditDebit)
router.route('/creditdebit_get').get(paymentController.getCreditDebit);
router.route('/get_creditdebitID').get(paymentController.getCreditDebitWithID);
router.route('/delete_creditdebitID').delete(paymentController.deleteCreditDebitWithCID);

module.exports = router;
