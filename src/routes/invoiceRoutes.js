const express = require('express');
const router = express.Router();
const invoiceContoller = require('../controllers/invoiceController');
router.route('/orders').post(invoiceContoller.postInvoice);
router.route('/orders/:orderId/invoice').get(invoiceContoller.getInvoice);

module.exports = router;
