const express = require('express');
const router = express.Router();
const basic_user = require('../functions/basic-user');

router.get('/logout', basic_user.logout);
router.post('/logout', basic_user.logout);
router.post('/resend-code', basic_user.resend_code);
router.post('/update-self', basic_user.update_self);
router.post('/change-password', basic_user.change_password);
router.get('/info', basic_user.info);
router.post('/info', basic_user.info);

module.exports = router;
