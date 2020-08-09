const router = require('express').Router();

router.get('/', function (req, res) {
    if (!req.session.currentUser) return res.redirect('/login')
    return res.render('profile');
})

module.exports = router;