const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true},
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        require: true
    },
}, {
    timestamps: true
})
FavoriteSchema.index({ user: 1, product: 1 }, { unique: true });

const FavoriteModel = mongoose.model('Favorite', FavoriteSchema);
module.exports = FavoriteModel;