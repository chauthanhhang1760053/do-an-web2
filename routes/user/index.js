const {Router}=require('express');

const router=new Router();

router.get('/', function (req,res){
 res.render('user/index');
});

module.exports= router;