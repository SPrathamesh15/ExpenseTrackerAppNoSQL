const express = require('express');
const userController = require('../controllers/signUp');
const router = express.Router();

router.post('/add-user', userController.postAddUser);

module.exports = router;
