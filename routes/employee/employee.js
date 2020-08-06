const {Router}=require('express');
const asyncHandler = require('express-async-handler');
const employee=require('../../services/employee');
const router = new Router();

router.get('/',  asyncHandler(async function (req,res){
    res.render('employee/employee');
}));

router.post('/', asyncHandler(async function (req, res) {
    try {
    const users = await employee.find_email(req.body.email);
    const checkpw = employee.verifyPassword(req.body.password,users.password);
    if (!users || !checkpw) {
        res.render('employee/employee');
    }
        req.session.employeemail = users.email;
        res.redirect('/activity');
    }catch (error) {
        console.log(error);
        res.status(500);
    }
    req.session.employeemail = employee.employeemail;
    //Đăng nhập thành công thì redirect về trang quản lí của nhân viên
    res.redirect('activity');
}));

module.exports = router;