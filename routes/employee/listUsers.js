const { Router } = require('express');
const User = require('../../services/users');
const Account = require('../../services/account');
const asyncHandler = require('express-async-handler');

const router = new Router(); 
router.get('/', asyncHandler(async function (req, res) {
    if (!req.currentEmployee) {
        res.redirect('/employee');
    }
 
    const users = await User.findAllAccounts();

    res.render('employee/listUsers', { users: users });
}));

router.post("/", asyncHandler(async function (req, res) {
}));

module.exports = router;


