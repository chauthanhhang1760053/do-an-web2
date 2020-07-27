const {Router}=require('express');
const User = require('../../services/users');
const asyncHandler = require('express-async-handler');
const employee=require('../../services/employee');

const router = new Router();

router.get('/', function getlogin(req,res){
    res.render('employee/employee');
});


router.post("/", asyncHandler(async function postLoginnhanvien(req, res) {
    const user = await employee.find_email(req.body.email)
    //Không tìm thấy User thì load lại trang Login
    if (!user || !User.verifyPassword(req.body.password, user.password)) {
        console.log("nhancho");
        return res.render('employee/employee');
    }
    req.session.userId = user.id
    //Đăng nhập thành công thì redirect về trang quản lí của nhân viên
    res.redirect('activity');
}));

module.exports = router;