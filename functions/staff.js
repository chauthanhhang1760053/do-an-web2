const asyncHandler = require('express-async-handler');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');
const send_email = require('../supports/send-email');
const USER = require('../services/user');
const CARD = require('../services/card');
const ACCOUNT = require('../services/account');
const HISTORY = require('../services/history');
const exchange = require('../supports/exchange');

module.exports.list_user = asyncHandler(async function(req, res, next) {
	var search = req.body.search || req.query.search;
	if (!search) search = '';
	var cardIdVerifyWhere = [ 0, 1 ];
	var cardIdVerify = req.body.cardIdVerify || req.query.cardIdVerify;
	if (cardIdVerify == 0) cardIdVerifyWhere = [ 0 ];
	else if (cardIdVerify == 1) cardIdVerifyWhere = [ 1 ];

	var start = req.body.start || req.query.start;
	var limit = req.body.limit || req.query.limit;
	start = start || 0;
	limit = limit || 7;
	start = start * limit;

	const list = await USER.findAndCountAll({
		where: {
			cardIdVerify: cardIdVerifyWhere,
			permission: 0,
			[Op.or]: [ Sequelize.where(Sequelize.col('email'), { [Op.like]: '%' + search + '%' }) ]
		},
		offset: Number(start),
		limit: Number(limit)
	});
	const rows = [];
	const result = { count: list.count };
	for (var i = 0; i < list.rows.length; i++) {
		var theUser = await USER.getUserInfoByPk(list.rows[i].id);
		rows.push(theUser);
	}
	result.rows = rows;

	return res.json(result);
});

module.exports.create_account = asyncHandler(async function(req, res, next) {
	const userId = req.body.id;
	const theUser = await USER.getUserInfoByPk(userId);
	if (!theUser) return res.json('fail');
	const accountType = req.body.accountType || 1;
	const balance = req.body.balance || 0;
	const currencyType = req.body.currencyType || 'VND';
	const term = req.body.term;
	if (accountType == 0 && term != 12 && term != 24 && term != 36) return res.json('fail');

	const accountId = await ACCOUNT.makeAccountId();
	const newAccount = await ACCOUNT.create({
		accountId: accountId,
		userId: userId,
		status: 1,
		balance: balance,
		currencyType: currencyType,
		accountType: accountType,
		startDate: new Date()
	});

	if (accountType == 0) {
		await ACCOUNT.update(
			{
				term: term
			},
			{
				where: {
					accountId: accountId
				}
			}
		);
	}

	return res.json('ok');
});

module.exports.load_up = asyncHandler(async function(req, res, next) {
	const accountId = req.body.accountId;
	const balance = req.body.balance;
	const currencyType = req.body.currencyType;

	const theAccount = await ACCOUNT.findOne({
		where: {
			accountId: accountId
		}
	});
	if (!theAccount) return res.json('fail');
	if (theAccount.accountType === 0 && theAccount.status !== 0) return res.json('fail');

	var oldBalance = parseFloat(theAccount.balance);
	var newBalance = parseFloat(balance);

	newBalance = exchange.exchange_currency(newBalance, currencyType, theAccount.currencyType);

	newBalance = newBalance + oldBalance;
	if (theAccount.status != 1) {
		await ACCOUNT.update(
			{
				status: 1,
				startDate: new Date(),
				closeDate: null
			},
			{
				where: {
					accountId: accountId
				}
			}
		);
	}

	await ACCOUNT.update(
		{
			balance: newBalance
		},
		{
			where: {
				accountId: accountId
			}
		}
	);

	await HISTORY.createNewHistory(accountId, '', '', balance, req.body.currencyType, 'loadup', 1);

	return res.json('ok');
});

module.exports.account_list_user = asyncHandler(async function(req, res, next) {
	const start = req.body.start || req.query.start;
	const limit = req.body.limit || req.query.limit;
	var id = req.body.id || req.query.id;
	if (!id) id = 0;
	const result = await ACCOUNT.getAccountListByUserId(id, start, limit, 1);

	return res.json(result);
});

// K
module.exports.n_list_account = async (req, res) => {
	const { id } = req.body;
	if (!id) return res.json(null);
	return res.json(await ACCOUNT.getAccountByID(id));
};

module.exports.verify_unverify = async (req, res) => {
	const { id } = req.body;
	if (!id) return res.json(null);
	return res.json(await USER.VerifyAndUnverify(id));
};
// End K

module.exports.info_user = asyncHandler(async function(req, res, next) {
	const userId = req.body.id || req.query.id;
	const result = await USER.getUserInfoByPk(userId);
	if (!result) return res.json('fail');
	return res.json(result);
});

module.exports.update_user = asyncHandler(async function(req, res, next) {
	const theUser = await USER.findByPk(req.body.id);
	if (!theUser) return res.json('fail');

	var newStatus = theUser.status;
	var newCardIdVerify = theUser.cardIdVerify;
	var newFullName = theUser.fullName;
	var newBirth = theUser.birth;
	var newAddress = theUser.address;
	var newPermission = theUser.permission;
	var newEmail = theUser.email;

	if (req.body.cardIdVerify && (req.body.cardIdVerify == 1 || req.body.cardIdVerify == 0)) {
		newCardIdVerify = req.body.cardIdVerify;
	}
	if (req.body.fullName && req.body.fullName != newFullName) newFullName = req.body.fullName;
	if (req.body.address && req.body.address != newAddress) newAddress = req.body.address;
	if (req.body.status && req.body.status != newStatus) newStatus = req.body.status;
	if (req.body.permission && (req.body.permission == 1 || req.body.permission == 0)) {
		newPermission = req.body.permission;
	}
	if (req.body.birth && req.body.birth != newBirth) {
		newBirth = moment(req.body.birth, 'YYYY-MM-DD').format('YYYY-MM-DD');
	} else {
		newBirth = moment(newBirth, 'YYYY-MM-DD').format('YYYY-MM-DD');
	}

	if (req.body.cardId && req.body.cardId != newCardId) newCardId = req.body.cardId;

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

		await USER.update(
			{
				emailVerify: 1
			},
			{
				where: {
					id: req.body.id
				}
			}
		);
	}

	await USER.update(
		{
			fullName: newFullName,
			birth: newBirth,
			address: newAddress,
			status: newStatus,
			permission: newPermission,
			email: newEmail,
			cardIdVerify: newCardIdVerify
		},
		{
			where: {
				id: req.body.id
			}
		}
	);

	return res.json('ok');
});

module.exports.update_account = asyncHandler(async function(req, res, next) {
	//lấy account cần update ra
	const accountId = req.body.accountId;
	const theAccount = await ACCOUNT.findOne({
		where: {
			accountId: accountId
		}
	});
	console.log(theAccount.accountType);
	console.log(theAccount.currencyType);
	var newStatus = theAccount.status;
	var newCurrency = theAccount.currencyType;
	var newTerm = theAccount.term;
	var TheCurrency = req.body.currencyType;
	//chuyển tiền khi đổi currency
	var newBalance = await exchange.exchange_currency(theAccount.balance, theAccount.currencyType, TheCurrency);

	if (req.body.status && req.body.status != newStatus) newStatus = req.body.status;
	if (req.body.term && req.body.term != newTerm) newTerm = req.body.term;
	if (newTerm != 12 && newTerm != 24 && newTerm != 36) return res.json('fail');

	if (req.body.currencyType && req.body.currencyType != newCurrency) {
		await ACCOUNT.update(
			{
				balance: newBalance
			},
			{
				where: {
					accountId: accountId
				}
			}
		);
	}
	newCurrency = req.body.currencyType;
	if (theAccount.accountType === 0) {
		await ACCOUNT.update(
			{
				term: newTerm
			},
			{
				where: {
					accountId: accountId
				}
			}
		);
	}
	await ACCOUNT.update(
		{
			status: newStatus,
			currencyType: newCurrency
		},
		{
			where: {
				accountId: accountId
			}
		}
	);
	return res.json('ok');
});

module.exports.history_user = asyncHandler(async function(req, res, next) {
	var start = req.body.start || req.query.start;
	var limit = req.body.limit || req.query.limit;
	const id = req.body.id || req.query.id;
	start = start || 0;
	limit = limit || 7;
	start = start * limit;
	var arr = [];

	//const check = Number.isNaN(id);
	if (!id || id == '') {
		const fullList = await HISTORY.findAndCountAll({
			order: [ [ 'createdAt', 'DESC' ] ],
			offset: Number(start),
			limit: Number(limit)
		});

		return res.json(fullList);
	}

	var theAccount = await ACCOUNT.findOne({
		where: {
			accountId: id
		}
	});

	// request with accountId
	if (theAccount) {
		arr = [];
		arr.push(theAccount.accountId);
		//	request with userId, find all AccountId belongs to this userId
	} else if (!theAccount) {
		arr = [];
		arr = await ACCOUNT.getAccountIdArrayByUserId(id, [ 0, 1 ], [ 0, 1 ]);
	}

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
