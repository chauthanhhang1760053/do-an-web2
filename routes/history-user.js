const router = require('express').Router();

router.get('/', function (req, res) {
	if (!req.session.currentUser) return res.redirect('/login')
	if (req.session.currentUser.permission != 1) return res.redirect('/')
	return res.render('./staff/history-user');
});

module.exports = router;
