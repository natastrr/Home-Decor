const express = require('express');
const CartController = require("../controllers/cart.controller");
const Auth = require("./../utils/common/auth");
const router = express.Router();

router.get('/', Auth.authenticateIfTokenExist, CartController.getCart);
router.get('/count', Auth.authenticateIfTokenExist, CartController.getCartCount);
router.post('/', Auth.authenticateIfTokenExist, CartController.updateCart);
router.delete('/', Auth.authenticateIfTokenExist, CartController.clearCart);

module.exports = router;