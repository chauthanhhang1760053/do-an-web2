const Employee = require('../services/employee');
const asyncHandler = require('express-async-handler');

module.exports = asyncHandler(async function auth(req, res, next) {
    const employeeId = req.session.employeeId;
    res.locals.employeeId = null;
    if (!employeeId) {
        return next();
    }
    const employee = await Employee.findEmployeeById(employeeId)
    if (!employee) {
        return next();
    }
    req.currentEmployee = employee;
    res.locals.currentEmployee = employee;
    next();
});