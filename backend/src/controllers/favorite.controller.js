const FavoriteModel = require("../models/favorite.model");
const FavoriteNormalizer = require("../normalizers/favorite.normalizer");
const ValidationUtils = require("../utils/validation.utils");
const ProductModel = require("../models/product.model");
const mongoose = require("mongoose");

class TypeController {
    static async getFavorites(req, res) {
        let favorites = await FavoriteModel.find({user: req.user.id}).populate('product');
        favorites = favorites.map(item => FavoriteNormalizer.normalize(item));
        res.json(favorites);
    }

    static async addFavorite(req, res) {
        const {error} = ValidationUtils.addFavoriteValidation(req.body);
        if (error) {
            return res.status(400).json({error: true, message: error.details[0].message});
        }
        const productId = req.body.productId;
        try {
            const product = await ProductModel.findOne({_id: productId});
            if (!product) {
                return res.status(404).json({error: true, message: 'Товар не найден'});
            }
        } catch (e) {
            return res.status(404).json({error: true, message: 'Товар не найден'});
        }

        const favorite = new FavoriteModel({
            product: new mongoose.Types.ObjectId(productId),
            user: new mongoose.Types.ObjectId(req.user.id),
        });

        try {
            await favorite.save();
        } catch (e) {
            console.log(e);
            return res.status(400).json({error: true, message: 'Не удалось добавить товар в избранное'});
        }

        await FavoriteModel.populate(favorite, {path: 'product'});

        res.json(FavoriteNormalizer.normalize(favorite));
    }

    static async removeFavorite(req, res) {
        const {error} = ValidationUtils.removeFavoriteValidation(req.body);
        if (error) {
            return res.status(400).json({error: true, message: error.details[0].message});
        }
        const productId = req.body.productId;
        await FavoriteModel.deleteOne({product: productId, user: req.user.id});

        res.json({error: false, message: 'Запись удалена'});
    }
}

module.exports = TypeController;