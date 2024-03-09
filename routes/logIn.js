const express = require('express');
const userController = require('../controllers/logIn');
const router = express.Router();

router.post('/login-user', userController.postLogInUser);

module.exports = router;
