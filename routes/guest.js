const express = require('express');
const router = express.Router();
const guest = require('../functions/guest');
const authentication = require('../middleware/authentication');

router.post('/login', authentication.needLogout, guest.login);
router.post('/register', authentication.needLogout, guest.register);
router.post('/send-code', authentication.needLogout, guest.send_code);
router.post('/new-password', authentication.needLogout, guest.new_password);
router.get('/verify-email', guest.verify_email);

module.exports = router;
