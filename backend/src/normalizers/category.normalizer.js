const BaseNormalizer = require("./base.normalizer");

class CategoryNormalizer extends BaseNormalizer {
    static normalize(category) {
        return {
            id: category._id,
            name: category.name,
            url: category.url
        }
    }
}

module.exports = CategoryNormalizer;