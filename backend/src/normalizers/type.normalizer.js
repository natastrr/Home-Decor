const BaseNormalizer = require("./base.normalizer");

class TypeNormalizer extends BaseNormalizer {
    static normalize(type) {
        return {
            id: type._id,
            name: type.name,
            category: {
                id: type.category._id,
                name: type.category.name,
                url: type.category.url
            },
            url: type.url
        }
    }
}

module.exports = TypeNormalizer;