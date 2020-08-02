const { Router } = require('express');
const thanhtoan=require('../../services/thanhtoan');
const account=require('../../services/account');
const asyncHandler=require('express-async-handler');
const crypto = require('crypto');
const router = new Router();

router.get('/', asyncHandler(async function (req, res) {
    if(!req.currentUser) {
        res.redirect('login');
    }
    console.log(req.currentUser);
    const lichsu = await thanhtoan.find_lichsu(req.currentUser.account.id);
    if(req.currentUser.account.kichhoat==false)
    {
        const thongbao=1;
        res.render('user/index', { user: req.currentUser,thongbao,lichsu });
    }
    else
    {
        const thongbao=null;
        const mabaomat = crypto.randomBytes(3).toString('hex').toUpperCase();
        res.render('user/index', { user: req.currentUser,thongbao,lichsu,mabaomat  });
    }  
 })); 

router.post("/", asyncHandler(async function (req, res) {
   try {
    if(req.body.btnnap== ''){
        const sotien= Number(req.body.sotiennap);
        const sotienhientai=Number(req.currentUser.account.sotien);
        const sotiendu=Number(sotienhientai+sotien);
        const matk="NAP" +account.getRandomInt(10000,99999);
        const checkmatk= await thanhtoan.find_matk(matk);
        if(!checkmatk){
            const checktaott=await thanhtoan.kiemtien(sotien,sotienhientai,sotiendu,matk,1,req.currentUser.account.id,false);
            if(checktaott){
                res.redirect('/user');
            }
        }
    }  
    if(req.body.btnrut== ''){
        const sotien= Number(req.body.sotienrut);
        const sotienhientai=Number(req.currentUser.account.sotien);
        const sotiendu=Number(sotienhientai-sotien-5000);
        const matk="RUT" +account.getRandomInt(10000,99999);
        const checkmatk= await thanhtoan.find_matk(matk);
        if(!checkmatk){
            const checktaott=await thanhtoan.kiemtien(sotien,sotienhientai,sotiendu,matk,2,req.currentUser.account.id,true);
            if(checktaott){
                const taikhoan=await account.find_id(req.currentUser.account.id);
                taikhoan.sotien=sotiendu;
                const checktks=taikhoan.save();
                if(checktks){
                    res.redirect('/user');
            }                
            }
        }
    }  
   } catch (error) {
       console.log("thong bao loi: ",error);
   } 
}));

module.exports = router;


