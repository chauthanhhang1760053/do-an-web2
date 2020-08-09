const asyncHandler = require('express-async-handler');
const USER = require('../services/user');

module.exports.needVerifyEmail = asyncHandler(async function(req, res, next) {
	const currentUser = req.session.currentUser;
	const result = await USER.checkVerifyEmail(currentUser);
	if (!result) return res.json('need verify email');
	return next();
});

module.exports.needVerifyCardId = asyncHandler(async function(req, res, next) {
	const currentUser = req.session.currentUser;
	const result = await USER.checkVerifyCardId(currentUser);
	if (!result) return res.json('need verify cardId');
	return next();
});

module.exports.needStaffPermission = asyncHandler(async function(req, res, next) {
	const currentUser = req.session.currentUser;
	const result = await USER.checkIsStaff(currentUser);
	if (!result) return res.json('need staff permission');
	return next();
});
