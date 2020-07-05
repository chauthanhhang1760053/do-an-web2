const { Router } = require('express');

const router = new Router();

router.get('/', function (req, res) {
    //Nếu người dùng chưa đăng nhập thì redirect về trang đăng nhập cho người dùng
    if(!req.currentUser) {
        res.redirect('login');
    }
    res.render('user/index', { user: req.currentUser });
});

module.exports = router;