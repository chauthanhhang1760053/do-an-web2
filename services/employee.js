const bcrypt = require('bcrypt');
const db = require('./db');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class Employee extends Model {
    static async find_email(emails)
    {
        return Employee.findOne({where:{email:emails}});
    }
    
    static hashPassword(password){
        return bcrypt.hashSync(password, 10);
    }

    static verifyPassword(password, passwordHash){
        return bcrypt.compareSync(password, passwordHash)
    }
    static async findEmployeeById(id) {
        return Employee.findByPk(id);
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