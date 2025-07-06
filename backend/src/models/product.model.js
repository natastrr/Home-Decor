const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'Type', required: true },
    lightning: String,
    humidity: String,
    temperature: String,
    height: Number,
    diameter: Number,
    url: String,
}, {
    timestamps: true,
});

const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;