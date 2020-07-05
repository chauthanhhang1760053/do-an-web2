module.exports = function index(req,res){
    req.session.views=(req.session.views || 0)+1;
    res.render('employee/active',{views: req.session.views});
};


const { Router } = require('express');

const router = new Router();

router.get('/', function (req, res) {
    if(!req.currentUser) {
        res.redirect('employee');
    }
    user = req.currentUser;
    res.render('employee/active', { user });
});

module.exports = router;