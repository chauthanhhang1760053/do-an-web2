const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const db = require('./db');
const moment = require('moment');

class card extends Model {}

card.init(
	{
		cardId: {
			type: Sequelize.STRING,
			allowNull: true,
			defaultValue: '',
			unique: true
		},
		cardType: {
			type: Sequelize.STRING,
			allowNull: true,
			defaultValue: 'CMND'
		},
		date: {
			type: Sequelize.DATEONLY,
			defaultValue: new Date(),
			get: function() {
				return moment.utc(this.getDataValue('date')).format('YYYY-MM-DD');
			}
		},
		URL: {
			type: Sequelize.STRING,
			allowNull: true,
			defaultValue: ''
		}
	},
	{
		sequelize: db,
		modelName: 'card'
	}
);

module.exports = card;
