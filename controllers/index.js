const Expense = require('../models/expense');
const User = require('../models/user')

exports.getAddExpense = (req, res, next) => {
  res.render('expense/add-expense', {
    pageTitle: 'Add Expense',
    path: '/expense/add-expense'
  });
};

exports.postAddExpense = async (req, res, next) => {
    try {
        const expenseAmount = req.body.expenseAmount;
        const expenseDescription = req.body.expenseDescription;
        const category = req.body.category;
        const userId = req.user._id;

    // Checking if the selected radio button is 'income' or 'expense'
    const isIncome = req.body.Income
    console.log('isincome: ', isIncome)
    // Creating a new expense
    const Details = new Expense(
      {
        [isIncome ? 'income' : 'expense']: expenseAmount,
        description: expenseDescription,
        category: category,
        userId: userId,
      },
    );
    Details.save()
    const user = await User.findById(userId);
    if (user) {
      if (isIncome) {
        user.totalIncome = user.totalIncome + parseInt(expenseAmount);
      } else {
        user.totalExpense = user.totalExpense + parseInt(expenseAmount);
      }
      await user.save();
    }

    res.status(201).json({ newExpenseDetails: Details });
    console.log('Expense added to server');
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err);
  }
};

exports.getAllExpenses = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 5;
        const skip = (page - 1) * itemsPerPage;

        const Count = Expense.countDocuments({ userId: req.user._id });
        const Expenses = Expense.find({ userId: req.user._id })
                                        .skip(skip)
                                        .limit(itemsPerPage)
                                        .exec();

        const [count, expenses] = await Promise.all([Count, Expenses]);

        const totalPages = Math.ceil(count / itemsPerPage);

        res.status(200).json({ expenses, totalPages, currentPage: page });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteExpense = async (req, res, next) => {
    const expenseId = req.params.expenseId;
    console.log('expenseId: ', expenseId);
    try {
        const expense = await Expense.findById(expenseId);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isIncome = expense.income;

        if (isIncome) {
            user.totalIncome -= parseInt(expense.income);
        } else {
            user.totalExpense -= parseInt(expense.expense);
        }

        await user.save();

        const result = await Expense.findByIdAndDelete(expenseId);
        if (!result) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        
        res.status(200).json({ message: 'Expense deleted successfully', result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    } 
};

