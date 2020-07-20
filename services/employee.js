const bcrypt = require('bcrypt');
const db = require('./db');
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class Employee extends Model {
    static async find_email(emails)
    {
        return Employee.findOne({where:{email:emails}});
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