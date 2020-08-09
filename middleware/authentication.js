const USER = require('../services/user');
const asyncHandler = require('express-async-handler');

module.exports.needLogout = function(req, res, next) {
	if (req.session.currentUser) return res.json('need logout');
	return next();
};

module.exports.needLogin = function(req, res, next) {
	if (!req.session.currentUser) return res.json('need login');
	return next();
};

module.exports.localCurrentUser = asyncHandler(async function(req, res, next) {
	req.currentUser = null;
	res.locals.currentUser = null;

	if (req.session.currentUser) {
		const theUser = await USER.getUserInfoByPk(req.session.currentUser.id);
		if (theUser) {
			req.currentUser = theUser;
			res.locals.currentUser = theUser;
		}
	}

	return next();
});
