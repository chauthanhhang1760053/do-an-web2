module.exports = function (req, res) {
    if (!req.currentEmployee) {
        res.redirect('/employee');
    }
    const employee = require('../../services/employee');
    res.render('employee/activity', { user: req.employee });
};
  