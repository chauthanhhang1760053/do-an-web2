const {Router}=require('express');
const User = require('../../services/users');
const asyncHandler = require('express-async-handler');
const Account = require('../../services/account');

const router = new Router();

router.get('/', asyncHandler(async function getListUsers(req,res){
    if(!req.currentUser) {
        res.redirect('employee');
    }  
    const listUsers= await User.findAll();
    res.render('employee/listUsers',{ listUsers });
}));


module.exports = router;