const { Router } = require('express');
const User = require('../../services/users');
const asyncHandler = require('express-async-handler');
const accountss = require('../../services/account');
const router = new Router();

router.get('/', asyncHandler(async function getlogin(req, res) {
    if (!req.currentEmployee) {
        res.redirect('employee');
    } 
    const cht = await User.find_all_where_kichhoat();
    const thongbao = null;
    res.render('employee/xacthuc', { cht, thongbao });
}));

router.post("/", asyncHandler(async function postLogin(req, res) {
    const cht = await User.find_all_where_kichhoat();
    const idac = req.body.btn_account_id;
    const checkac = await accountss.find_id(idac);
    if (checkac) {
        checkac.tinhtrang = true;
        checkac.kichhoat = true;
        const check = checkac.save();
        if (check) {
            const thongbao = "1";
            res.render('employee/xacthuc', { cht, thongbao })
        }
        else {
            const thongbao = "2";
            res.render('employee/xacthuc', { cht, thongbao })
        }
    }
}));

module.exports = router;