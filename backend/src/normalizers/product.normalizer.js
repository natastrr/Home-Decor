const BaseNormalizer = require("./base.normalizer");

class ProductNormalizer extends BaseNormalizer {
    static normalize(product) {
        let obj = {
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            lightning: product.lightning,
            humidity: product.humidity,
            temperature: product.temperature,
            height: product.height,
            diameter: product.diameter,
            url: product.url
        };

        if (product.type) {
            const type = Array.isArray(product.type) ? product.type[0] : product.type;
            obj.type = {
                id: type._id,
                name: type.name,
                url: type.url
            }
        }

        return obj;
    }
}

module.exports = ProductNormalizer;