const express = require('express');
const TypeController = require("../controllers/type.controller");
const router = express.Router();

router.get('/', TypeController.getTypes);

module.exports = router;