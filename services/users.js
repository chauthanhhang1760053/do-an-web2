const bcrypt = require('bcrypt');
const db = require('./db');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class User extends Model {
    static async findUserById(id){
        return User.findByPk(id);
    }

    static async findUserByEmail(email){
        return User.findOne({
            where: {
                email,
            }
        })
    }

    static hashPassword(password){
        return bcrypt.hashSync(password, 10);
    }

    static verifyPassword(password, passwordHash){
        return bcrypt.compareSync(password, passwordHash)
    }
    
    static addUser(user){
        return user.save();
    }

}
User.init({
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    displayName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
    },
}, {
    sequelize: db,
    modelName: 'user',
})

module.exports = User;