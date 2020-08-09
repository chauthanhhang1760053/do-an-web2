const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const db = require('./db');
const moment = require('moment');

class account extends Model {
	static async calculateProfitAndDaysReached(theAccount) {
		//default is for 12 months of term
		var profitPercent = [ 0.03, 0.05 ];
		if (theAccount.term == 24) profitPercent = [ 0.04, 0.06 ];
		else if (theAccount.term == 36) profitPercent = [ 0.05, 0.07 ];

		//days = currentDate - startDate
		const startDate = moment(theAccount.dataValues.startDate);
		const currentDate = new moment();
		var days = moment(currentDate, 'YYYY-MM-DD').diff(moment(startDate, 'YYYY-MM-DD'), 'days');

		var profitPercentBeforeTerm = profitPercent[0] / 360;
		var profitPercentTerm = profitPercent[1];
		var isTermReached = false;
		if (theAccount.term == 12 && days > 359) isTermReached = true;
		else if (theAccount.term == 24 && days > 719) isTermReached = true;
		else if (theAccount.term == 36 && days > 1079) isTermReached = true;

		const result = { days: days };

		if (isTermReached) result.profit = parseFloat(theAccount.balance) * profitPercentTerm;
		else {
			result.profit = parseFloat(theAccount.balance) * profitPercentBeforeTerm * days;
		}

		return result;
	}

	static async getAccountIdArrayByUserId(userId, accountType, status) {
		var statusArr = [ 0, 1 ];
		if (status == 1) statusArr = [ 1 ];
		if (status == 0) statusArr = [ 0 ];
		var accountTypeArr = [ 0, 1 ];
		if (accountType == 1) accountTypeArr = [ 1 ];
		else if (accountType == 0) accountTypeArr = [ 0 ];

		var all = await account.findAll({
			where: {
				userId: userId,
				accountType: accountTypeArr,
				status: statusArr
			}
		});

		var arr = [];

		all.map((item) => {
			arr.push(item.accountId);
		});

		return arr;
	}

	static async makeAccountId() {
		var result = Math.floor(1000000000 + Math.random() * 10000000000).toString();

		var foundAccountId = await account.findOne({
			where: {
				accountId: result
			}
		});
		while (foundAccountId != null) {
			result = Math.floor(1000000000 + Math.random() * 10000000000).toString();

			foundAccountId = await account.findOne({
				where: {
					accountId: result
				}
			});
		}

		return result;
	}

	static async getAccountListByUserId(id, start, limit, status) {
		var statusArr = [ 0, 1 ];
		if (status == 1) statusArr = [ 1 ];
		if (status == 0) statusArr = [ 0 ];

		var start = start || 0;
		var limit = limit || 7;
		start = start * limit;

		const result = await account.findAndCountAll({
			where: {
				userId: id,
				status: statusArr
			},
			offset: Number(start),
			limit: Number(limit)
		});

		return result;
	}

	// K
	static async getAccountByID(id) {
		const found = await account.findAll({
			where: {
				userId: id,
				status: 1
			},
			order: [ [ 'createdAt', 'DESC' ] ]
		});

		return !found
			? null
			: found.map((item) => ({
					accountID: item.accountId,
					money: item.balance,
					currency: item.currencyType,
					cardType: item.accountType
				}));
	}

	// end K
}

account.init(
	{
		accountId: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true
		},
		userId: {
			type: Sequelize.INTEGER,
			allowNull: false
		},
		status: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		balance: {
			type: Sequelize.DECIMAL,
			allowNull: false,
			defaultValue: 0
		},
		currencyType: {
			type: Sequelize.STRING,
			allowNull: false,
			defaultValue: 'VND'
		},
		accountType: {
			type: Sequelize.INTEGER, //1 là thanh toán, 0 là tiết kiệm
			allowNull: false,
			defaultValue: 1
		},
		startDate: {
			type: Sequelize.DATEONLY,
			allowNull: false,
			defaultValue: new Date(),
			get: function() {
				var result = moment.utc(this.getDataValue('startDate')).format('YYYY-MM-DD');
				if (result == 'Invalid date') return '';
				return result;
			}
		},
		closeDate: {
			type: Sequelize.DATEONLY,
			allowNull: true,
			defaultValue: null,
			get: function() {
				var result = moment.utc(this.getDataValue('closeDate')).format('YYYY-MM-DD');
				if (result == 'Invalid date') return '';
				return result;
			}
		},
		term: {
			//12, 24, 36 tháng
			type: Sequelize.INTEGER,
			allowNull: true,
			defaultValue: null
		}
	},
	{
		sequelize: db,
		modelName: 'account'
	}
);

module.exports = account;
