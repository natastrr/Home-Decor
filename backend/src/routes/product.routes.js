const express = require('express');
const ProductController = require("../controllers/product.controller");
const router = express.Router();

router.get('/', ProductController.getProducts);
router.get('/search', ProductController.searchProducts);
router.get('/best', ProductController.getBestProducts);
router.get('/:url', ProductController.getProduct);

module.exports = router;