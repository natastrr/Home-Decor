const CategoryModel = require("../models/category.model");
const CategoryNormalizer = require("../normalizers/category.normalizer");

class CategoryController {
    static async getCategories(req, res) {
        let categories = await CategoryModel.find().lean();
        categories = categories.map(item => CategoryNormalizer.normalize(item));
        res.json(categories);
    }
}

module.exports = CategoryController;