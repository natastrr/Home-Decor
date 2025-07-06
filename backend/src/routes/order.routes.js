const express = require('express');
const Auth = require("./../utils/common/auth");
const OrderController = require("../controllers/order.controller");
const router = express.Router();

router.get('/', Auth.authenticate, OrderController.getOrders);
router.post('/', Auth.authenticateIfTokenExist, OrderController.createOrder);

module.exports = router;