const { Router } = require('express');
const User = require('../services/user');
const asyncHandler = require('express-async-handler');

const router = new Router();

router.get('/login', function getLogin(req, res){
    res.render('login')
});

router.post('/login', asyncHandler(async function postLogin(req, res){
    const user = await User.findUserByEmail(req.body.email)
    //Không tìm thấy User thì load lại trang Login
    if(!user || !User.verifyPassword(req.body.password, user.password)){
        return res.render('login')
    }
    req.session.userId = user.id
    res.redirect('user');
}));

module.exports = router;