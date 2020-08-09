const router = require('express').Router();

router.get('/', function (req, res) {
    return res.render('forget-password');
})

module.exports = router;