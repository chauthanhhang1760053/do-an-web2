const User = require('../services/users');
const asyncHandler = require('express-async-handler');

<<<<<<< HEAD
module.exports = asyncHandler(async function (req, res, next) {
    const userId = req.session.userId
=======
module.exports = asyncHandler(async function auth(req, res, next) {
    const userId = req.session.userId;
>>>>>>> e7d397ce0640916416ff4bb0951e8ce95e9ab952
    res.locals.currentUser = null;
    if (!userId) {
        return next();
    }
    const user = await User.find_all_join_account(userId)
    if (!user) {
        return next();
    }
    req.currentUser = user
    res.locals.currentUser = user;
    next();
});

