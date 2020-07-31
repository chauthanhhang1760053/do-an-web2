const bcrypt = require('bcrypt');
const db = require('./db');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class Employee extends Model {
    static async find_email(emails)
    {
        return Employee.findOne({where:{email:emails}});
    }
<<<<<<< HEAD
    static hashPassword(password){
        return bcrypt.hashSync(password, 10);
    }

    static verifyPassword(password, passwordHash){
        return bcrypt.compareSync(password, passwordHash)
=======

    static async findEmployeeById(id) {
        return Employee.findByPk(id);
>>>>>>> e7d397ce0640916416ff4bb0951e8ce95e9ab952
    }
}

Employee.init({
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
   
}, {
    sequelize: db,
    modelName: 'employee',
})

module.exports=Employee;