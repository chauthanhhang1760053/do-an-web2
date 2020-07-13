const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const User = require('../services/users');

const router = new Router();

router.get('/', function (req, res) {
    res.render('register');
});

router.post('/register', asyncHandler(async function postLogin(req, res) {
    
    let hash = bcrypt.hashSync(req.body.password, 10);
    _email = req.body.email;
    _displayName = req.body.displayName;
    _phoneNumber = req.body.phoneNumber;

    const user = await User.create({
        email: _email,
        displayName: _displayName,
        password: hash,
        phoneNumber: _phoneNumber
    });
    
    alert("Đăng kí thành công, tự động chuyển sang trang đăng nhập!");
    res.redirect(login);
}));

module.exports = router;


