const CartModel = require("../models/cart.model");
const mongoose = require("mongoose");

class CartService {
    static async getCart(user, sessionId) {
        let cartModel;
        if (user && user.id) {
            cartModel = await CartModel.findOne({user: user.id}).populate({path: 'items.product'});
            if (!cartModel && sessionId) {
                cartModel = await CartModel.findOne({sessionId: sessionId}).populate({path: 'items.product'});
                if (cartModel) {
                    cartModel.sessionId = null;
                    cartModel.user = new mongoose.Types.ObjectId(user.id);
                    await cartModel.save();
                }
            }
        } else if (sessionId) {
            cartModel = await CartModel.findOne({sessionId: sessionId}).populate({path: 'items.product'});
        }

        if (!cartModel) {
            cartModel = new CartModel({items: []});
            if (user) {
                cartModel.user = new mongoose.Types.ObjectId(user.id);
            } else if (sessionId) {
                cartModel.sessionId = sessionId;
            }
            await cartModel.save();
        }

        return cartModel;
    }

    static async clearCart(cart) {
        cart.items = [];
        await cart.save();
    }
}

module.exports = CartService;