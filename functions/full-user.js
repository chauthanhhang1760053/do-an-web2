const asyncHandler = require('express-async-handler');
const moment = require('moment');
const send_email = require('../supports/send-email');
const exchange = require('../supports/exchange');
const USER = require('../services/user');
const CARD = require('../services/card');
const ACCOUNT = require('../services/account');
const HISTORY = require('../services/history');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports.account_list = asyncHandler(async function(req, res, next) {
	const start = req.body.start || req.query.start;
	const limit = req.body.limit || req.query.limit;
	const result = await ACCOUNT.getAccountListByUserId(req.session.currentUser.id, start, limit, 1);

	return res.json(result);
});

module.exports.account_array = asyncHandler(async function(req, res, next) {
	const accountType = req.body.accountType || req.query.accountType || 1;
	const result = await ACCOUNT.getAccountIdArrayByUserId(req.session.currentUser.id, accountType, 1);

	return res.json(result);
});

module.exports.account_info = asyncHandler(async function(req, res, next) {
	const accountId = req.body.accountId || req.query.accountId;
	const result = await ACCOUNT.findOne({
		where: {
			accountId: accountId
		}
	});

	return res.json(result);
});

module.exports.history = asyncHandler(async function(req, res, next) {
	const accountId = req.body.accountId || req.query.accountId;
	var start = req.body.start || req.query.start;
	var limit = req.body.limit || req.query.limit;
	start = start || 0;
	limit = limit || 7;
	start = start * limit;

	//mảng lưu danh sách accountid thuộc user nào
	var arr = await ACCOUNT.getAccountIdArrayByUserId(req.session.currentUser.id, [ 0, 1 ], [ 0, 1 ]);

	if (accountId) {
		if (!arr.includes(accountId)) arr = [];
		else {
			arr = [];
			arr.push(accountId);
		}
	}
	//nếu không nhập acccountid là trả về hết liên quan đến stk của user đó
	const list = await HISTORY.findAndCountAll({
		where: {
			[Op.or]: [ { accountId_1: arr }, { accountId_2: arr } ]
		},
		order: [ [ 'createdAt', 'DESC' ] ],
		offset: Number(start),
		limit: Number(limit)
	});

	return res.json(list);
});

module.exports.withdraw = asyncHandler(async function(req, res, next) {
	const accountId = req.body.accountId;
	const code = req.body.code;
	var arr = [];
	arr = await ACCOUNT.getAccountIdArrayByUserId(req.session.currentUser.id, [ 1, 2 ], 1);

	if (!arr.includes(accountId)) return res.json('not owner');

	const theAccount = await ACCOUNT.findOne({
		where: {
			accountId: accountId
		}
	});

	if (theAccount.accountType == 1) return res.json('not owner');
	if (theAccount.status == 0) return res.json('locked');

	const theUserByCode = await USER.findOne({
		where: {
			userCode: code
		}
	});

	if (!theUserByCode || theUserByCode.id != req.session.currentUser.id) return res.json('wrong code');

	//calculate and then send E-mail
	const profitAndDays = await ACCOUNT.calculateProfitAndDaysReached(theAccount);

	const content =
		'Số tài khoản: ' +
		theAccount.accountId +
		', Vốn: ' +
		theAccount.balance +
		' ' +
		theAccount.currencyType +
		', Lãi: ' +
		profitAndDays.profit +
		' ' +
		theAccount.currencyType +
		', ' +
		'Số ngày gửi: ' +
		profitAndDays.days +
		' ngày , Kỳ hạn: ' +
		theAccount.term +
		' tháng.';
	setTimeout(function() {
		send_email.send(theUserByCode.email, 'Rút tiền vốn và lãi', content, content);
	}, 500);

	await USER.update(
		{
			userCode: ''
		},
		{
			where: {
				id: req.session.currentUser.id
			}
		}
	);
	console.log(req.body.message);
	await HISTORY.createNewHistory(
		accountId,
		'',
		req.body.message,
		parseFloat(profitAndDays.profit) + parseFloat(theAccount.balance),
		theAccount.currencyType,
		'withdraw',
		1
	);

	await ACCOUNT.update(
		{
			balance: 0,
			status: 0,
			closeDate: moment()
		},
		{
			where: {
				accountId: accountId
			}
		}
	);

	return res.json('ok');
});

module.exports.transfer = asyncHandler(async function(req, res, next) {
	const accountId_1 = req.body.accountId_1;
	const accountId_2 = req.body.accountId_2;
	var amount = req.body.amount;
	const message = req.body.message || 'không có!';
	const code = req.body.code;

	if (!amount || parseFloat(amount) <= 0) return res.json('over balance');
	var arr = [];
	var fee = 0.0;

	arr = await ACCOUNT.getAccountIdArrayByUserId(req.session.currentUser.id, [ 1, 2 ], 1);

	if (!arr.includes(accountId_1)) return res.json('not owner');

	const theUserByCode = await USER.findOne({
		where: {
			userCode: code
		}
	});

	if (!theUserByCode || theUserByCode.id != req.session.currentUser.id) return res.json('wrong code');

	const theAccount_1 = await ACCOUNT.findOne({
		where: {
			accountId: accountId_1
		}
	});
	const theAccount_2 = await ACCOUNT.findOne({
		where: {
			accountId: accountId_2
		}
	});

	if (!theAccount_2 || theAccount_2.accountType == 0) return res.json('accountId_2  not exists');
	if (theAccount_2.status == 0) return res.json('accountId_2  locked');

	if (theAccount_1.accountType == 0) return res.json('not owner');
	if (theAccount_1.status == 0) return res.json('accountId_1  locked');

	if (theAccount_1.currencyType == 'USD') {
		var tempAmount = exchange.exchange_currency(amount, 'USD', 'VND');
		if (parseFloat(tempAmount) >= 30000000) {
			fee = amount * 0.02;
		} else if (parseFloat(tempAmount) >= 10000000) {
			fee = amount * 0.01;
		}

		if (parseFloat(tempAmount) > 50000000) {
			return res.json('limit');
		}
	} else {
		if (parseFloat(amount) >= 30000000) {
			fee = amount * 0.02;
		} else if (parseFloat(amount) >= 10000000) {
			fee = amount * 0.01;
		}

		if (parseFloat(amount) > 50000000) {
			return res.json('limit');
		}
	}

	if (parseFloat(amount) + parseFloat(fee) > parseFloat(theAccount_1.balance)) {
		return res.json('over balance');
	}

	var newBalance_1 = parseFloat(theAccount_1.balance) - (parseFloat(amount) + parseFloat(fee));

	var newBalance_2 = parseFloat(amount) + parseFloat(theAccount_2.balance);
	if (theAccount_2.currencyType != theAccount_1.currencyType) {
		newBalance_2 = exchange.exchange_currency(newBalance_2, theAccount_1.currencyType, theAccount_2.currencyType);
	}

	//update and send mail
	await ACCOUNT.update(
		{
			balance: newBalance_1
		},
		{
			where: {
				accountId: accountId_1
			}
		}
	);
	await ACCOUNT.update(
		{
			balance: newBalance_2
		},
		{
			where: {
				accountId: accountId_2
			}
		}
	);
	await USER.update(
		{
			userCode: ''
		},
		{
			where: {
				id: theUserByCode.id
			}
		}
	);

	await HISTORY.createNewHistory(accountId_1, accountId_2, message, amount, theAccount_1.currencyType, 'transfer', 1);

	const theUser_2 = await USER.findOne({
		where: {
			id: theAccount_2.userId
		}
	});

	//mailer here
	const content_1 =
		'Chuyển tiền từ Số tài khoản ' +
		accountId_1 +
		', cho Số tài khoản: ' +
		accountId_2 +
		', Số tiền: ' +
		amount +
		' ' +
		theAccount_1.currencyType +
		', Phí là: ' +
		fee +
		' ' +
		theAccount_1.currencyType;

	const content_2 =
		'Nhận tiền từ Số tài khoản ' +
		accountId_1 +
		', cho Số tài khoản: ' +
		accountId_2 +
		', Số tiền: ' +
		amount +
		' ' +
		theAccount_1.currencyType;

	setTimeout(function() {
		send_email.send(theUserByCode.email, 'Chuyển khoản', content_1, content_1);
	}, 500);

	setTimeout(function() {
		send_email.send(theUser_2.email, 'Nhận chuyển khoản', content_2, content_2);
	}, 500);

	return res.json('ok');
});

module.exports.fee = asyncHandler(async function(req, res) {
	const accountId = req.body.accountId || req.query.accountId;
	var amount = req.body.amount || req.query.amount;
	if (!amount) amount = 0.0;
	var fee = 0.0;
	const foundAccount = await ACCOUNT.findOne({
		where: {
			accountId: accountId
		}
	});
	const currencyType = foundAccount.currencyType;

	if (currencyType == 'USD') {
		var tempAmount = exchange.exchange_currency(amount, 'USD', 'VND');
		if (parseFloat(tempAmount) >= 30000000) {
			fee = amount * 0.02;
		} else if (parseFloat(tempAmount) >= 10000000) {
			fee = amount * 0.01;
		}
	} else {
		if (parseFloat(amount) >= 30000000) {
			fee = amount * 0.02;
		} else if (parseFloat(amount) >= 10000000) {
			fee = amount * 0.01;
		}
	}
	return res.json({ currencyType: foundAccount.currencyType, fee: fee });
});

module.exports.profit = asyncHandler(async function(req, res, next) {
	const accountId = req.body.accountId || req.query.accountId;
	var result = 0.0;
	const theAccount = await ACCOUNT.findOne({
		where: {
			accountId: accountId,
			accountType: 0
		}
	});
	if (theAccount) {
		const profitAndDays = await ACCOUNT.calculateProfitAndDaysReached(theAccount);
		result = profitAndDays.profit;
	}

	return res.json(result);
});
