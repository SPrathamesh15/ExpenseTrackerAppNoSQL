const User = require('../models/user');

exports.showLeaderBoard = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 5;
        const skip = (page - 1) * itemsPerPage;

        const leaderboardofusers = await User.find({})
            .select('id name totalExpense')
            .sort({ totalExpense: -1 })
            .skip(skip)
            .limit(itemsPerPage);

        const totalCount = await User.countDocuments();
        const totalPages = Math.ceil(totalCount / itemsPerPage);

        res.status(200).json({ allLeaderBoardUsers: leaderboardofusers, totalPages, currentPage: page });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

