const { Router } = require('express');
const User = require('../services/users');
const asyncHandler = require('express-async-handler');

const router = new Router();
router.get('/', asyncHandler(async function getlogin(req, res) {
    res.render('login');
}));

router.post('/', asyncHandler(async function postLogin(req, res) {
    const user = await User.findUserByEmail(req.body.email)
    //Không tìm thấy User thì load lại trang Login
    if (!user || !User.verifyPassword(req.body.password, user.password)) {
        return res.render('login')
    }
    req.session.userId = user.id
    //Đăng nhập thành công thì redirect về trang dành cho User
    res.redirect('user');

    console.log(res.session.userId);
}));

module.exports = router;

