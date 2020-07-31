<<<<<<< HEAD
module.exports = function (req,res){
    if(!req.currentEmployee) {
        res.redirect('/employee');
    }    
    const employee=require('../../services/employee');
    res.render('employee/activity', { user: req.employee });    
};
=======
const { Router } = require('express');
const Employee = require('../../services/employee');
const asyncHandler = require('express-async-handler');

const router = new Router();

router.get('/', function index(req,res){
    //Nếu nhân viên chưa đăng nhập thì redirect về trang đăng nhập cho nhân viên
    if(!req.currentEmployee) {
        res.redirect('employee');
    }    
    res.render('employee/activity', { user: req.currentUser });
});



module.exports = router;
>>>>>>> e7d397ce0640916416ff4bb0951e8ce95e9ab952
