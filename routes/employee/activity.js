const { Router } = require('express');
const Employee = require('../../services/employee');
const asyncHandler = require('express-async-handler');

const router = new Router();

router.get('/', function index(req,res){
    //Nếu nhân viên chưa đăng nhập thì redirect về trang đăng nhập cho nhân viên
    if(!req.currentUser) {
        res.redirect('employee');
    }    
    res.render('employee/activity', { user: req.currentUser });
});



module.exports = router;
