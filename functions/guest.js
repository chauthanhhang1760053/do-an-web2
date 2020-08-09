const asyncHandler = require('express-async-handler');
const moment = require('moment');
const send_email = require('../supports/send-email');
const USER = require('../services/user');
const CARD = require('../services/card');

module.exports.login = asyncHandler(async function(req, res, next) {
	const username = req.body.username;
	const password = req.body.password;
	if (!username || !password) return res.json('fail');

	const theUser = await USER.findUserByUsername(username);
	if (theUser) {
		if (theUser.status == 0) return res.json('Bạn đã bị khóa! hãy liên hệ nhân viên.');
		if (await USER.verifyPassword(password, theUser.password)) {
			req.session.currentUser = theUser;
			if (theUser.emailVerify === 0) return res.json('email');
			return res.json('ok');
		}
	}

	return res.json('fail');
});

module.exports.register = asyncHandler(async function(req, res, next) {
	const email = req.body.email;
	const username = req.body.username;
	const fullName = req.body.fullName;
	const cardId = req.body.cardId;
	const cardType = req.body.cardType;
	var date = req.body.date;
	const address = req.body.address;
	var birth = req.body.birth;
	const password = req.body.password;
	const password_retype = req.body.password_retype;

	if (
		!email ||
		!username ||
		!fullName ||
		!cardId ||
		!cardType ||
		!date ||
		!address ||
		!birth ||
		!password ||
		!password_retype
	) {
		return res.json('empty');
	}
	if (email.includes(' ') || username.includes(' ')) {
		return res.json('wrong type');
	}
	if (password !== password_retype) {
		return res.json('not equal');
	}
	if (await USER.emailExistYet(email)) {
		return res.json('email used');
	}
	if (await USER.usernameExistYet(username)) {
		return res.json('username used');
	}
	if (await USER.cardIdExistYet(cardId)) {
		return res.json('cardId used');
	}

	const newUserCode = await USER.makeUserCode();
	await USER.create({
		email: email,
		username: username,
		cardId: cardId,
		fullName: fullName,
		birth: moment(birth),
		address: address,
		password: await USER.hashPassword(password),
		userCode: newUserCode
	});
	await CARD.create({
		cardId: cardId,
		cardType: cardType,
		date: moment(date)
	});

	setTimeout(function() {
		send_email.send(email, 'Mã của bạn', newUserCode, newUserCode);
	}, 500);

	return res.json('ok');
});

module.exports.send_code = asyncHandler(async function(req, res, next) {
	const email = req.body.email;
	if (!email) return res.json('fail');
	const theUser = await USER.findOne({
		where: {
			email: email
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
		send_email.send(email, 'Mã của bạn', newUserCode, newUserCode);
	}, 500);

	return res.json('ok');
});

module.exports.verify_email = asyncHandler(async function(req, res, next) {
	const code = req.query.code;
	if (!code) return res.json('fail');
	const theUser = await USER.findOne({
		where: {
			userCode: code
		}
	});
	if (!theUser) return res.json('fail');

	await USER.update(
		{
			userCode: '',
			emailVerify: 1
		},
		{
			where: {
				id: theUser.id
			}
		}
	);

	res.json('ok');
});

module.exports.new_password = asyncHandler(async function(req, res, next) {
	const code = req.body.code;
	const password = req.body.password;
	const password_retype = req.body.password_retype;
	if (!code || !password || !password_retype) return res.json('empty');
	if (password !== password_retype) return res.json('not equal');

	const theUser = await USER.findOne({
		where: {
			userCode: code
		}
	});
	if (!theUser) return res.json('wrong code');
	await USER.update(
		{
			userCode: '',
			emailVerify: 1,
			password: await USER.hashPassword(password)
		},
		{
			where: {
				id: theUser.id
			}
		}
	);

	res.json('ok');
});
