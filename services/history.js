const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const db = require('./db');
const moment = require('moment');

class history extends Model {
	static async getHistoryByPk(id) {
		const TheHistory = await history.findByPk(id);
		if (!TheHistory) return null;
		return TheHistory;
	}

	static async createNewHistory(accountId_1, accountId_2, message, value, currencyType, action, status) {
		console.log(message);
		const checkMessage = message || 'không có!';
		console.log(checkMessage);
		await history.create({
			accountId_1: accountId_1,
			accountId_2: accountId_2,
			status: status,
			action: action,
			value: value,
			currencyType: currencyType,
			message: checkMessage,
			time: moment()
		});
	}
}

history.init(
	{
		accountId_1: {
			type: Sequelize.STRING,
			allowNull: true,
			defaultValue: ''
		},
		accountId_2: {
			type: Sequelize.STRING,
			allowNull: true,
			defaultValue: ''
		},
		time: {
			type: Sequelize.DATE,
			defaultValue: new Date(),
			get: function() {
				return moment.utc(this.getDataValue('time')).format('YYYY-MM-DD HH:mm:ss');
			}
		},
		message: {
			type: Sequelize.TEXT,
			allowNull: true,
			defaultValue: ''
		},
		value: {
			type: Sequelize.DECIMAL,
			allowNull: true,
			defaultValue: 0
		},
		currencyType: {
			type: Sequelize.STRING,
			allowNull: false,
			defaultValue: 'VND'
		},
		action: {
			type: Sequelize.STRING,
			allowNull: false,
			defaultValue: 'transfer'
		},
		status: {
			type: Sequelize.INTEGER,
			defaultValue: 1
		}
	},
	{
		sequelize: db,
		modelName: 'history'
	}
);

module.exports = history;
