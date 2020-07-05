const { Router } = require('express');
const User = require('E:/KiCuoi/Web2/Do An/DoAnWeb/services/user');
const asyncHandler = require('express-async-handler');

const router = new Router();

router.get('/', function getLogin(req, res){
    res.render('employee/index')
});

router.post('/employee', asyncHandler(async function postLogin(req, res){
    const user = await User.findUserByEmail(req.body.email)
    //Không tìm thấy nhân viên thì load lại trang Login
    if(!user || !User.verifyPassword(req.body.password, user.password)){
        return res.render('employee/index');
    }
    // Đăng nhâp thành công redirect về trang active cho nhân viên
    res.redirect('active');
}));

module.exports = router;