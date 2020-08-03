const User = require('../services/users');
const asyncHandler = require('express-async-handler');
module.exports = asyncHandler(async function (req, res, next) {
    const userId = req.session.userId
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