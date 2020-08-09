const bcrypt = require('bcrypt');
const db = require('./db');
const Sequelize = require('sequelize');
const account = require('./account');
const { findAll } = require('./account');
const Model = Sequelize.Model;
class thanhtoan extends Model {
    static async kiemtien( sotiennap,tientruoc, tiensau, matk, loaitk, acc_id,tinhtrang) {
        return thanhtoan.create({
            tienbitru: sotiennap,
            mataikhoan:matk,
            loaitaikhoan:loaitk,  
            accountId: acc_id,
            tienhienco: tientruoc,
            tienconlai: tiensau,
            tinhtrang: tinhtrang,
        })  
    } 
    static async find_matk(matk){
        return thanhtoan.findOne({
            where:{
                mataikhoan:matk,
            }
        })
    }
    static async find_id(id){
        return thanhtoan.findByPk(id);
    }
    static async find_All(){
        return thanhtoan.findAll({
            where: {tinhtrang: false,}
        })
    }
    static async find_lichsu(id)
    {
        return thanhtoan.findAll({where:{accountId:id}})
    }
}
thanhtoan.init({
    mataikhoan: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    loaitaikhoan: {
        type: Sequelize.STRING,
        allowNull: false,
    }, 
    tienhienco: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    tienbitru: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    tienconlai: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    tinhtrang: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
}, { 
    sequelize: db,
    modelName: 'thanhtoan',
}) 
module.exports= thanhtoan;