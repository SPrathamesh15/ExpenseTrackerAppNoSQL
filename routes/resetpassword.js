const express = require('express');
const resetPasswordController = require('../controllers/resetpassword');
const router = express.Router();

router.post('/resetpassword/:token', resetPasswordController.resetPassword);
module.exports = router;
