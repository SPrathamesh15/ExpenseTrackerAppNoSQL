const express = require('express');
const purchaseController = require('../controllers/purchase');
const userAuthentication = require('../middleware/auth')
const router = express.Router();

router.get('/premiummembership', userAuthentication.Authenticate, purchaseController.purchasePremium);
router.get('/premium-status', userAuthentication.Authenticate, purchaseController.isPremiumUser);
router.post('/updatetransactionstatus', userAuthentication.Authenticate, purchaseController.updateTransactionStatus);

module.exports = router;
