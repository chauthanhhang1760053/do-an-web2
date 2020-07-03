module.exports = function index(req,res){
    req.session.views=(req.session.views || 0)+1;
    res.render('employee/active',{views: req.session.views});
};
