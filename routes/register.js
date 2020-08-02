const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const c = require('crypto');
const email= require('../services/email');
const account=require('../services/account');
const User = require('../services/users');
const router = new Router();

router.get('/', asyncHandler(async function (req, res) {
    res.render('register');
}));

router.post('/', asyncHandler(async function postLogin(req, res) {    
    let hash = bcrypt.hashSync(req.body.password, 10);
    _email = req.body.email;
    _displayName = req.body.displayName;
    _phoneNumber = req.body.phoneNumber;
    _token=c.randomBytes(3).toString('hex').toUpperCase();
    const user = await User.create({
        email: _email,
        displayName: _displayName,
        password: hash,
        phoneNumber: _phoneNumber,
        token:_token,
    });
    if (user)
    {
        await email.guikichhoat(_email,"NHHK Bank kích hoạt email",_token);
        res.redirect('/login');
    }   
}));

module.exports = router;


