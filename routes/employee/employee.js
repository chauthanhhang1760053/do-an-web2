// module.exports = function index(req,res){
//     req.session.views=(req.session.views || 0)+1;
//     res.render('employee/index',{views: req.session.views});
// };

const {Router}=require('express');
const User = require('E:/KiCuoi/Web2/Do An/DoAnWeb/services/users');
const asyncHandler = require('express-async-handler');


const router = new Router();
router.get('/', function getlogin(req,res){
 res.render('employee/employee');
});


router.post("", asyncHandler(async function postLogin(req, res) {
    const user = await User.findUserByEmail(req.body.email)
    //Không tìm thấy User thì load lại trang Login
    if (!user || !User.verifyPassword(req.body.password, user.password)) {
        return res.render('employee');
    }
    req.session.userId = user.id
    //Đăng nhập thành công thì redirect về trang quản lí của nhân viên
    res.redirect('activity');
}));

module.exports = router;