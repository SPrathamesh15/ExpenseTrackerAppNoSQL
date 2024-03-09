// expenseRoutes.js
const express = require('express');
const expenseController = require('../controllers/index');
const userAuthentication = require('../middleware/auth')
const router = express.Router();

router.get('/add-expense', userAuthentication.Authenticate, expenseController.getAddExpense);
router.post('/add-expense', userAuthentication.Authenticate, expenseController.postAddExpense);
router.get('/get-expenses',userAuthentication.Authenticate, expenseController.getAllExpenses);
router.delete('/delete-expense/:expenseId', userAuthentication.Authenticate, expenseController.deleteExpense);
// router.get('/download', userAuthentication.Authenticate, expenseController.downloadExpenses)
// router.post('/postfileurls', userAuthentication.Authenticate, expenseController.postFileURLS)
// router.get('/getfileurls', userAuthentication.Authenticate, expenseController.getFileURLS)

module.exports = router;
