const CategoryController = require('../controllers/category.controller');
const express = require('express');
const router = express.Router();

router.get('/', CategoryController.getCategories);

module.exports = router;