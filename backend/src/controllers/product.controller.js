const ProductModel = require("../models/product.model");
const ProductNormalizer = require("../normalizers/product.normalizer");
const TypeModel = require("../models/type.model");

class ProductController {

    static async getProducts(req, res) {
        const itemsPerPage = 9;
        const page = parseInt(req.query['page'], 10) || 1;

        const filter = {};
        if (req.query['heightFrom'] || req.query['heightTo']) {
            filter.height = {};
            if (req.query['heightFrom']) {
                filter.height.$gte = +req.query['heightFrom'];
            }
            if (req.query['heightTo']) {
                filter.height.$lte = +req.query['heightTo'];
            }
        }

        if (req.query['diameterFrom'] || req.query['diameterTo']) {
            filter.diameter = {};
            if (req.query['diameterFrom']) {
                filter.diameter.$gte = +req.query['diameterFrom'];
            }
            if (req.query['diameterTo']) {
                filter.diameter.$lte = +req.query['diameterTo'];
            }
        }


        let productsQuery;
        let productsQueryCount;
        if (req.query['types']) {
            const typeModels = await TypeModel.find({'url': {$in: req.query['types']}});
            const typeModelsIds = typeModels.map(item => (item.id));
            filter.type = {$in: typeModelsIds};
            // productsQuery = ProductModel.aggregate([
            //         {
            //             $lookup: {
            //                 from: "types",
            //                 localField: "type", // field of reference to subItem
            //                 foreignField: "_id",
            //                 as: "type"
            //             }
            //         },
            //         {
            //             $match: Object.assign({'type.url': {$in: types}}, filter)
            //         },
            //     ]
            // );
        } else {
            // productsQuery = ProductModel.find(filter).populate('type');
            // productsQueryCount = ProductModel.count(filter);
        }

        productsQuery = ProductModel.find(filter).populate('type');
        productsQueryCount = ProductModel.count(filter);

        if (req.query['sort']) {
            switch (req.query['sort']) {
                case 'az-asc':
                    productsQuery.sort({name: 'asc'});
                    break;
                case 'az-desc':
                    productsQuery.sort({name: 'desc'});
                    break;
                case 'price-asc':
                    productsQuery.sort({price: 'asc'});
                    break;
                case 'price-desc':
                    productsQuery.sort({price: 'desc'});
                    break;
            }
        }


        productsQuery.limit(itemsPerPage).skip(itemsPerPage * (page - 1));

        let products = await productsQuery;
        let productsCount = await productsQueryCount;
        products = products.map(item => ProductNormalizer.normalize(item));
        res.json({
            totalCount: productsCount,
            pages: Math.ceil(productsCount / itemsPerPage),
            items: products
        });
    }

    static async searchProducts(req, res) {
        const {query} = req.query;
        if (!query) {
            return res.status(400)
                .json({error: true, message: "Не передан параметр query"});
        }

        let products = await ProductModel
            .find({ "name": { "$regex": query, "$options": "i" } })
            .populate('type')
            .limit(5)
            .lean();

        products = products.map(item => ProductNormalizer.normalize(item));
        res.json(products);
    }

    static async getBestProducts(req, res) {
        let products = await ProductModel.find().populate('type').lean();
        const count = 8;
        const randomIndex = Math.floor(Math.random() * (products.length - count) + 1) - 1;
        products = products.slice(randomIndex, randomIndex + count);

        products = products.map(item => ProductNormalizer.normalize(item));
        res.json(products);
    }

    static async getProduct(req, res) {
        const {url} = req.params;
        if (!url) {
            return res.status(400)
                .json({error: true, message: "Не передан параметр id"});
        }

        let product = await ProductModel.findOne({url: url}).populate('type');
        if (!product) {
            return res.status(404)
                .json({error: true, message: "Продукт не найден"});
        }

        res.json(ProductNormalizer.normalize(product));
    }
}

module.exports = ProductController;