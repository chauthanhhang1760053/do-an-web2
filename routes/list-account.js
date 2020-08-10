const router = require('express').Router();

router.get('/', function (req, res) {
	if (!req.session.currentUser) return res.redirect('/login')
	return res.render('list-account');
});

module.exports = router;
 