const TypeModel = require("../models/type.model");
const TypeNormalizer = require("../normalizers/type.normalizer");

class TypeController {
    static async getTypes(req, res) {
        let types = await TypeModel.find().populate('category');
        types = types.map(item => TypeNormalizer.normalize(item));
        res.json(types);
    }
}

module.exports = TypeController;