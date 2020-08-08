
const { Router } = require('express');
const taikhoan=require('../../services/account');
const asyncHandler = require('express-async-handler');
const user=require('../../services/users'); 
const { validationResult } = require('express-validator');
const router = new Router();


router.get('/:token',  asyncHandler (async function (req, res) {
    const {token}=req.params;
    if(token==1) 
    {
        res.render('user/active',{thongbao:"thanh cong"})
    }
    else if(token==2)
    {
        res.render('user/active',{thongbao:"that bai"})        
    }
    else
    {
        const checkuser= await user.findUserByToken(token);
        if(checkuser)
        {
            const updatetoken = await user.save_token_null(checkuser)
            if(updatetoken)
            {
                while(true)
                {
                    const stk = taikhoan.getRandomInt(100000000000,999999999999).toString();
                    const checkstk = await taikhoan.findSoTaiKhoan(stk);
                    if(!checkstk)
                    {
                        const check_create = await taikhoan.save_create(stk,0,"VNĐ",false,false,checkuser.id)
                        if(check_create)
                        {
                            
                            res.redirect('/active/1');
                            break;
                        }
                        else
                        {
                            res.redirect('/active/2');
                            break;
                        }
                    }
                }
            }
        }
        else
        {
            res.redirect('/active/2');
        }
    }    
}));

module.exports=router;
