const router = require('express').Router();
const path = require('path');
var multer = require('multer');
const card = require('../services/card');
var upload = multer({ dest: path.join(__dirname, '..', '/public/img') })
let error = null;
router.get('/', (req, res) => {
    if (!req.session.currentUser) return res.redirect('/login')
    return res.render('verify-card', { error })
})
router.post('/', upload.single('img'), async (req, res) => {
    error = null;

    // chưa đăng nhập
    if (!req.session.currentUser) return res.redirect('/login');
    // không tải file
    if (!req.file) {
        error = "Vui lòng chọn ảnh";
        return res.redirect('/verify-card')
    }
    const image = req.file.filename;

    // lỗi gì đấy ko tìm thấy filename
    if (!image) {
        error = "Đã xảy ra lỗi với file vừa gửi";
        return res.redirect('/verify-card')
    }

    // update
    const rs = await card.update({
        URL: image
    }, {
        where: {
            cardId: req.session.currentUser.cardId
        }
    })
    // lỗi gì đấy không update được
    if (!rs) {
        error = "Đã xảy ra lỗi, không thể gửi yêu cầu. Vui lòng thử lại";
        return res.redirect('/verify-card')
    }

    // thành công
    error = null;
    return res.redirect('/profile')
})
module.exports = router;