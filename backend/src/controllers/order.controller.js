const OrderModel = require("../models/order.model");
const OrderNormalizer = require("../normalizers/order.normalizer");
const ValidationUtils = require("../utils/validation.utils");
const CartService = require("../services/cart.service");
const config = require("../config/config");

class OrderController {
    static async getOrders(req, res) {
        let orders;
        if (req.user && req.user.id) {
            orders = await OrderModel.find({user: req.user.id});
        } else if (req.session && req.session.id) {
            orders = await OrderModel.find({sessionId: req.session.id});
        } else {
            return res.status(404)
                .json({error: true, message: "Заказы не найдены"});
        }
        res.json(orders.map(item => OrderNormalizer.normalize(item)));
    }

    static async createOrder(req, res) {
        const {error} = ValidationUtils.createOrderValidation(req.body);
        if (error) {
            console.log(error.details);
            return res.status(400).json({error: true, message: error.details[0].message});
        }

        const cartModel = await CartService.getCart(req.user, req.session.id);

        if (!cartModel || !cartModel.items || cartModel.items.length === 0) {
            return res.status(404)
                .json({error: true, message: "Корзина пустая"});
        }

        const bodyObject = {
            deliveryCost: config.deliveryCost,
            deliveryType: req.body.deliveryType,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            email: req.body.email,
            paymentType: req.body.paymentType,
            status: 'new'
        };

        if (req.body.fatherName) {
            bodyObject.fatherName = req.body.fatherName;
        }
        if (req.body.comment) {
            bodyObject.comment = req.body.comment;
        }

        const order = new OrderModel(bodyObject);

        if (req.user && req.user.id) {
            order.user = req.user.id;
        } else if (req.session && req.session.id) {
            order.sessionId = req.session.id;
        } else {
            return res.status(404)
                .json({error: true, message: "Пользователь не найден"});
        }

        if (req.deliveryType === config.deliveryTypes.delivery) {
            order.deliveryInfo = {
                street: req.body.street,
                house: req.body.house,
                entrance: req.body?.entrance,
                apartment: req.body?.apartment,
            };
        }

        if (!order.items) {
            order.items = [];
        }
        let total = 0;
        cartModel.items.forEach(item => {
            const itemTotal = item.product.price * item.quantity;
            order.items.push({
                productName: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
                total: itemTotal,
            });
            total += itemTotal;
        });

        if (req.body.deliveryType === config.deliveryTypes.delivery) {
            total += config.deliveryCost;
        }
        order.totalAmount = total;

        try {
            const orderResult = await order.save();
            if (!orderResult) {
                console.log(orderResult);
                return res.status(500).json({error: true, message: 'Не удалось оформить заказ'});
            }
        } catch (e) {
            console.log(e);
            return res.status(500).json({error: true, message: 'Не удалось оформить заказ'});
        }

        try {
            const cartClearingResult = await CartService.clearCart(cartModel);
            if (!cartClearingResult) {
                console.log(cartClearingResult);
                // return res.status(500).json({error: true, message: 'Не удалось очистить корзину'});
            }
        } catch (e) {
            console.log(e);
            // return res.status(500).json({error: true, message: 'Не удалось очистить корзину'});
        }

        res.json(OrderNormalizer.normalize(order));
    }
}

module.exports = OrderController;