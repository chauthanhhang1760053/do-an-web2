const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const db = require('./db');
const moment = require('moment');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Op = Sequelize.Op;
const CARD = require('./card');

class user extends Model {
	static async getUserInfoByPk(id) {
		const result = {};
		const TheUser = await user.findByPk(id);
		if (!TheUser) return null;
		const TheCard = await CARD.findOne({
			where: {
				cardId: TheUser.cardId
			}
		});
		result.id = TheUser.id;
		result.email = TheUser.email;
		result.username = TheUser.username;
		result.permission = TheUser.permission;
		result.cardIdVerify = TheUser.cardIdVerify;
		result.emailVerify = TheUser.emailVerify;
		result.fullName = TheUser.fullName;
		result.address = TheUser.address;
		result.birth = TheUser.birth;
		result.status = TheUser.status;

		result.cardId = TheUser.cardId;
		if (TheCard) {
			result.cardType = TheCard.cardType;
			result.date = TheCard.date;
			result.URL = TheCard.URL;
		}

		return result;
	}

	//K

	static async VerifyAndUnverify(id) {
		const found = await user.findByPk(id);
		if (!found) return null;
		found.cardIdVerify = found.cardIdVerify == 0 ? 1 : 0;
		return found.save();
	}

	//End K
	static async emailExistYet(email) {
		const result = await user.findOne({
			where: {
				email: email
			}
		});
		return result;
	}

	static async usernameExistYet(username) {
		const result = await user.findOne({
			where: {
				username: username
			}
		});
		return result;
	}

	static async cardIdExistYet(cardId) {
		const result = await user.findOne({
			where: {
				cardId: cardId
			}
		});
		return result;
	}

	static async makeUserCode() {
		var result = crypto.randomBytes(6).toString('hex').toUpperCase();
		var userCodeExist = await user.findOne({
			where: {
				userCode: result
			}
		});

		while (userCodeExist != null) {
			result = crypto.randomBytes(6).toString('hex').toUpperCase();
			userCodeExist = await user.findOne({
				where: {
					userCode: result
				}
			});
		}

		return result;
	}

	static async findUserByUsername(username) {
		const result = await user.findOne({
			where: {
				[Op.or]: [{ email: username }, { username: username }]
			}
		});

		return result;
	}

	static async checkVerifyEmail(currentUser) {
		const result = await user.findOne({
			where: {
				id: currentUser.id,
				emailVerify: 1
			}
		});

		return result;
	}

	static async checkVerifyCardId(currentUser) {
		const result = await user.findOne({
			where: {
				id: currentUser.id,
				cardIdVerify: 1
			}
		});

		return result;
	}

	static async checkIsStaff(currentUser) {
		const result = await user.findOne({
			where: {
				id: currentUser.id,
				permission: 1
			}
		});

		return result;
	}

	static hashPassword(passwordInput) {
		return bcrypt.hashSync(passwordInput, 10);
	}
	static verifyPassword(passwordsUnHashed, passwordsHashed) {
		return bcrypt.compareSync(passwordsUnHashed, passwordsHashed);
	}
}

user.init(
	{
		cardId: {
			type: Sequelize.STRING,
			allowNull: true,
			defaultValue: '',
			unique: true
		},
		email: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true
		},
		username: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true
		},
		fullName: {
			type: Sequelize.STRING,
			allowNull: true,
			defaultValue: 'người dùng chưa đặt tên'
		},
		permission: {
			//0 là người dùng, 1 là nhân viên
			type: Sequelize.INTEGER,
			defaultValue: 0
		},
		cardIdVerify: {
			//0 là chưa, 1 là rồi
			type: Sequelize.INTEGER,
			defaultValue: 0
		},
		emailVerify: {
			//0 là chưa, 1 là rồi
			type: Sequelize.INTEGER,
			defaultValue: 0
		},
		status: {
			// 0 là khóa, 1 là mở
			type: Sequelize.INTEGER,
			defaultValue: 1
		},
		birth: {
			type: Sequelize.DATEONLY,
			defaultValue: new Date(),
			get: function () {
				return moment.utc(this.getDataValue('birth')).format('YYYY-MM-DD');
			}
		},
		address: {
			type: Sequelize.STRING,
			allowNull: true,
			defaultValue: ''
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false
		},
		userCode: {
			type: Sequelize.STRING,
			allowNull: true,
			defaultValue: ''
		}
	},
	{
		sequelize: db,
		modelName: 'user'
	}
);

module.exports = user;
