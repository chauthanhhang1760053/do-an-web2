const bcrypt = require('bcrypt');
const db = require('./db');
const Sequelize = require('sequelize');
const thanhtoan = require('./thanhtoan');
const Model = Sequelize.Model;

class account extends Model {
    static getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max); 
        return Math.floor(Math.random() * (max - min + 1)) + min;
    } 
    static async find_id(id)
    { 
        return account.findByPk(id);
    }
    static async findSoTaiKhoan(sotaikhoans){
        
        return account.findOne({
            where: {
                sotaikhoan:sotaikhoans,
            }
        })
    }
    static async save_create(stks,sotiens,tiente,tinhtrangs,kichhoats,id)
    {
        return account.create({
            sotaikhoan:stks,
            sotien:sotiens,
            donvitiente:tiente,
            tinhtrang:tinhtrangs,
            kichhoat:kichhoats,
            userId:id
        })
    }
}

account.init({
    sotaikhoan: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    sotien: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    donvitiente: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    tinhtrang: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    kichhoat: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
}, {
    sequelize: db,
    modelName: 'account',
})

account.hasOne(thanhtoan);
thanhtoan.belongsTo(account);
module.exports = account;