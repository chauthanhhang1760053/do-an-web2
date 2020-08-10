const asyncHandler = require('express-async-handler');
const moment = require('moment');
const send_email = require('../supports/send-email');
const USER = require('../services/user');
const CARD = require('../services/card');
const HISTORY = require('../services/history');

module.exports.logout = function(req, res, next) {
	req.session.currentUser = null;
	delete req.session.currentUser;
	delete req.session;

	return res.json('ok');
};

module.exports.resend_code = asyncHandler(async function(req, res, next) {
	if (!req.session.currentUser.id) return res.json('fail');
	const theUser = await USER.findOne({
		where: {
			id: req.session.currentUser.id
		}
	});
	if (!theUser) return res.json('fail');
	const newUserCode = await USER.makeUserCode();
	await USER.update(
		{
			userCode: newUserCode
		},
		{
			where: {
				id: theUser.id
			}
		}
	);

	setTimeout(function() {
		send_email.send(theUser.email, 'Mã của bạn', newUserCode, newUserCode);
	}, 500);

	return res.json('ok');
});

module.exports.update_self = asyncHandler(async function(req, res, next) {
	const theUser = await USER.findByPk(req.session.currentUser.id);
	const theCard = await CARD.findOne({
		where: {
			cardId: theUser.cardId
		}
	});

	var newFullName = theUser.fullName;
	var newBirth = theUser.birth;
	var newAddress = theUser.address;
	var newCardId = theUser.cardId;
	var newDate = theCard.date;
	var newCardType = theCard.cardType;
	var newEmail = theUser.email;

	if (req.body.cardType && req.body.cardType != newCardType) {
		if (req.body.cardType == 'CMND' || req.body.cardType == 'CCCD') newCardType = req.body.cardType;
	}
	if (req.body.fullName && req.body.fullName != newFullName) newFullName = req.body.fullName;
	if (req.body.address && req.body.address != newAddress) newAddress = req.body.address;

	if (req.body.birth && req.body.birth != newBirth) {
		newBirth = moment(req.body.birth);
	} else {
		newBirth = moment(newBirth);
	}

	if (req.body.date && req.body.date != newDate) {
		newDate = moment(req.body.date);
	} else {
		newDate = moment(newDate);
	}

	if (req.body.cardId && req.body.cardId != newCardId) {
		const checkCardId = USER.cardIdExistYet(req.body.cardId);
		if (checkCardId) return res.json('cardId used');

		newCardId = req.body.cardId;

		await USER.update(
			{
				cardIdVerify: 0
			},
			{
				where: {
					id: req.session.currentUser.id
				}
			}
		);
	}

	if (req.body.email && req.body.email != newEmail) {
		const checkEmail = await USER.emailExistYet(req.body.email);
		if (checkEmail) return res.json('email used');

		//send to old email
		setTimeout(function() {
			send_email.send(
				theUser.email,
				'email đã đổi',
				'email mới là: ' + req.body.email,
				'email mới là: ' + req.body.email
			);
		}, 500);

		newEmail = req.body.email;
	}

	await USER.update(
		{
			fullName: newFullName,
			birth: newBirth,
			address: newAddress,
			cardId: newCardId,
			email: newEmail
		},
		{
			where: {
				id: req.session.currentUser.id
			}
		}
	);

	await CARD.update(
		{
			cardId: newCardId,
			cardType: newCardType,
			date: newDate
		},
		{
			where: {
				cardId: theCard.cardId
			}
		}
	);

	return res.json('ok');
});

module.exports.change_password = asyncHandler(async function(req, res, next) {
	if (!req.session.currentUser) return res.json('need login');
	const result = await USER.findUserByUsername(req.session.currentUser.email);

	if (!result) return res.json('error'); // lỗi gì đấy không tìm thấy tài khoản. thường thì ko xảy ra

	// lấy data từ request
	const { password, password_old, password_retype } = req.body;

	// kiểm tra dữ liệu
	if (!password_old || !password || !password_retype) return res.json('empty');

	// kiểm tra mật khẩu xác thực
	if (password !== password_retype) return res.json('not equal');
	// kiểm tra mật khẩu cũ
	if (!await USER.verifyPassword(password_old, result.password)) return res.json('wrong password');
	// update

	// 1 cach
	// result.password = USER.hashPassword(password);
	// await result.save();

	// cach 2
	const rs = await USER.update(
		{
			password: await USER.hashPassword(password)
		},
		{
			where: {
				email: result.email
			}
		}
	);
	if (!rs) return res.json('error'); // lỗi gì đấy không thể update
	// thành công
	return res.json('ok');
});

module.exports.info = asyncHandler(async function(req, res, next) {
	const result = await USER.getUserInfoByPk(req.session.currentUser.id);

	return res.json(result);
});
