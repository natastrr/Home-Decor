const express = require('express');
const Auth = require("./../utils/common/auth");
const FavoriteController = require("../controllers/favorite.controller");
const router = express.Router();

router.get('/', Auth.authenticate, FavoriteController.getFavorites);
router.post('/', Auth.authenticate, FavoriteController.addFavorite);
router.delete('/', Auth.authenticate, FavoriteController.removeFavorite);

module.exports = router;