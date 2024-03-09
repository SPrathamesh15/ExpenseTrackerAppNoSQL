const express = require('express');
const reportController = require('../controllers/report');
const userAuthentication = require('../middleware/auth')
const router = express.Router();

router.get('/get-report',userAuthentication.Authenticate, reportController.getAllReports);
module.exports = router;