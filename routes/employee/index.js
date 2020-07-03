module.exports = function index(req,res){
    req.session.views=(req.session.views || 0)+1;
    res.render('employee/index',{views: req.session.views});
};
