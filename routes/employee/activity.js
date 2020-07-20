module.exports = function index(req,res){
    //Nếu nhân viên chưa đăng nhập thì redirect về trang đăng nhập cho nhân viên
    if(!req.currentUser) {
        res.redirect('employee');
    }    
    const employee=require('../../services/employee');
    res.render('employee/activity', { user: req.currentUser });
    
};
