const express = require('express');
const UserController = require("../controllers/user.controller");
const Auth = require("../utils/common/auth");
const router = express.Router();

router.get('/', Auth.authenticate, UserController.getUserInfo);
router.post('/', Auth.authenticate, UserController.updateUserInfo);

module.exports = router;