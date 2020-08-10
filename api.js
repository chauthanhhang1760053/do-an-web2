const express = require('express');
const router = express.Router();
const authentication = require('./middleware/authentication');
const authorization = require('./middleware/authorization');

router.use(authentication.localCurrentUser);
router.use('/', require('./routes/guest'));

router.use(authentication.needLogin);
router.use('/', require('./routes/basic-user'));

router.use(authorization.needVerifyEmail, authorization.needVerifyCardId);
router.use('/', require('./routes/full-user'));

router.use(authorization.needStaffPermission);
router.use('/', require('./routes/staff'));
 
module.exports = router;
