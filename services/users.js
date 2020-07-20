const bcrypt = require('bcrypt');
const db = require('./db');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const accountss =require('./account');

class User extends Model {
    static async find_all_where_kichhoat()
    {
        return User.findAll({include:[{model:accountss,where:{kichhoat:false}}]});
    }
    static async findUserById(id){
        return User.findByPk(id);
    }
    static async findUserByToken(tokens){
        return User.findOne({
            where: {
                token:tokens,
            }
        });
    }
    static async save_token_null(user)
    {
        user.token=null;
        return user.save();
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
    token: {
        type: Sequelize.STRING,
    },
}, {
    sequelize: db,
    modelName: 'user',
})

User.hasOne(accountss);
accountss.belongsTo(User);

module.exports = User;