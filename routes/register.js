const {Router}=require('express');
const {body, validationResult}=require('express-validator');
const asyncHandler=require('express-async-handler')
const crypto=require('crypto');
const router=new Router();

router.get('/', function (req,res){
 res.render('register');
});

module.exports= router;

