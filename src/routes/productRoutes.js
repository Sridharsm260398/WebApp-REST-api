const express = require('express');
const router = express.Router();
const productController = require('../controllers/productsController');
router.route('/getallProducts').get(productController.getallProducts);
router.route('/cart').post(productController.addItemstoCart);
module.exports = router;