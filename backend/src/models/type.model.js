const mongoose = require('mongoose');

const TypeSchema = new mongoose.Schema({
    name: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    url: String,
});

const TypeModel = mongoose.model('Type', TypeSchema);

module.exports = TypeModel;