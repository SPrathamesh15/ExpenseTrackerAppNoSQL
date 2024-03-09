const express = require('express');
const leaderboardController = require('../controllers/premium');
const router = express.Router();

router.get('/leaderboard', leaderboardController.showLeaderBoard);

module.exports = router;
