const express = require('express');
const router = express.Router();
const full_user = require('../functions/full-user');

router.get('/account-list', full_user.account_list);
router.post('/account-list', full_user.account_list);

router.get('/account-array', full_user.account_array);
router.post('/account-array', full_user.account_array);

router.get('/account-info', full_user.account_info);
router.post('/account-info', full_user.account_info);

router.get('/history', full_user.history);
router.post('/history', full_user.history);

router.post('/withdraw', full_user.withdraw);

router.get('/profit', full_user.profit);
router.post('/profit', full_user.profit);

router.get('/fee', full_user.fee);
router.post('/fee', full_user.fee);

router.post('/transfer', full_user.transfer);

module.exports = router;
