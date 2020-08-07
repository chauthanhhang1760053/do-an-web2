const {Router}=require('express');
const thanhtoan = require('../../services/thanhtoan');
const asyncHandler = require('express-async-handler');
const accountss=require('../../services/account');
const router = new Router();
router.get('/', asyncHandler(async function (req,res){
    if(!req.currentEmployee)  {
        res.redirect('employee');
    }   
    const cht= await thanhtoan.find_All()
    console.log(cht)  
    const thongbao=null;
    res.render('employee/naptien',{cht,thongbao});
}));
router.post("/", asyncHandler(async function (req, res) {
    console.log(req.body);
    if(req.body.btnxacnhan!=null){  
        const tt=await thanhtoan.find_id(req.body.btnxacnhan);
        const tk=await accountss.find_id(tt.accountId);
        tt.tinhtrang=true;
        const checktt=tt.save();
        tk.sotien= tk.sotien+tt.tienbitru;
        const checktk=tk.save();
        if(checktt){
            if(checktk){
                res.redirect('/naptien');
            }
        }
    }
}));
module.exports = router;