const {Router}=require('express');
const {body, validationResult}=require('express-validator');
const asyncHandler=require('express-async-handler')
<<<<<<< HEAD
const bcrypt = require('bcrypt');
const User = require('E:/KiCuoi/Web2/Do An/DoAnWeb/services/user');

const router = new Router();

router.get('/', function (req,res){
    res.render('register');
   });
   

router.post('/register', asyncHandler(async function postRegister(req, res){
    password = User.hashPassword(req.body.password);
    email = req.body.email;
    displayName = req.body.displayName;
    phoneNumber = req.body.phoneNumber;

    const user = await User.create({
        email: email,
        password: password,
        displayName: displayName,
        phoneNumber: phoneNumber
    })
}));

module.exports = router;
=======
const crypto=require('crypto');
const router=new Router();

router.get('/', function (req,res){
 res.render('register');
});

module.exports= router;

>>>>>>> origin/master
