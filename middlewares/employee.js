const employee = require('../services/employee');
const asyncHandler = require('express-async-handler');
module.exports = asyncHandler(async function (req, res, next) {
    const employeemail = req.session.employeemail;
    res.locals.currentUser = null;
    if (!employeemail) {
        return next();
    } 
    const Employee = await employee.find_email(employeemail)
    if (!employeemail) {
        return next();
    }
    req.currentEmployee = Employee;
    res.locals.currentEmployee = Employee;
    next(); 
});
