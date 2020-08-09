const express = require('express');
const router = express.Router();
const staff = require('../functions/staff');
const { route } = require('./list-user');

router.get('/list-user', staff.list_user);
router.post('/list-user', staff.list_user);

router.post('/create-account', staff.create_account);

router.post('/load-up', staff.load_up);

router.get('/account-list-user', staff.account_list_user);
router.post('/account-list-user', staff.account_list_user);

//K
router.post('/n-list-account', staff.n_list_account);
router.post('/n-verify-and-unverify', staff.verify_unverify);
//End k

router.get('/info-user', staff.info_user);
router.post('/info-user', staff.info_user);

router.post('/update-user', staff.update_user);

router.post('/update-account', staff.update_account);

router.get('/history-user', staff.history_user);
router.post('/history-user', staff.history_user);

module.exports = router;
