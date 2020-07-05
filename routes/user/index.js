const { Router } = require('express');

const router = new Router();

router.get('/', function (req, res) {
    if(!req.currentUser) {
        res.redirect('login');
    }
    user = req.currentUser;
    res.render('user/index', { user });
});

module.exports = router;