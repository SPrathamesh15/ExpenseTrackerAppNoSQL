const Expense = require('../models/expense');

exports.getAllReports = async (req, res, next) => {
    try {
        let startDate, endDate;
        const timePeriod = req.query.timePeriod;
        const page = req.query.page || 1;
        const itemsPerPage = req.query.itemsPerPage ? parseInt(req.query.itemsPerPage, 10) : 10;
        const offset = (page - 1) * itemsPerPage;
        const limit = itemsPerPage;
        console.log('page',page)
        if (timePeriod === 'daily') {
            startDate = new Date();
            endDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        } else if (timePeriod === 'weekly') {
            startDate = new Date(new Date() - new Date().getDay() * 24 * 60 * 60 * 1000);
            endDate = new Date(new Date() - new Date().getDay() * 24 * 60 * 60 * 1000 + 7 * 24 * 60 * 60 * 1000);
        } else if (timePeriod === 'monthly') {
            startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        } else if (timePeriod === 'yearly') {
            startDate = new Date(new Date().getFullYear(), 0, 1);
            endDate = new Date(new Date().getFullYear(), 11, 31);
        }

        // Adjust start and end dates to match the time zone of the createdAt field
        startDate.setHours(startDate.getHours() - 11); 
        endDate.setHours(endDate.getHours() - 11); 

        const expenses = await Expense.find({
            userId: req.user._id,
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        })
            .select('_id income expense description category createdAt')
            .skip(offset)
            .limit(limit)
            .exec();

        const totalExpenses = await Expense.countDocuments({
            userId: req.user._id,
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        });
        console.log('startdate', startDate, endDate)
        const totalPages = Math.ceil(totalExpenses / limit);
        console.log('expenses',expenses)
        res.status(200).json({
            allExpenses: expenses,
            totalPages: totalPages,
            currentPage: page,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log('error year', err);
    }
};
