
const {Router}=require('express');
const router=new Router();

router.get('/', function getlogin(req,res){
 res.render('login');
});
module.exports= router;
