const router = require('express').Router();

router.get('/', function(req, res) {
	return res.render('about');
});

module.exports = router;
