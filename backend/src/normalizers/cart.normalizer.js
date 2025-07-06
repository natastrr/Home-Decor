const BaseNormalizer = require("./base.normalizer");

class CartNormalizer extends BaseNormalizer {
    static normalize(cart) {
        return {
            items: cart.items ? cart.items.map(item => {
                return {
                    product: {
                        id: item.product.id,
                        name: item.product.name,
                        url: item.product.url,
                        image: item.product.image,
                        price: item.product.price,
                    },
                    quantity: item.quantity
                };
            }) : []
        };
    }
}

module.exports = CartNormalizer;