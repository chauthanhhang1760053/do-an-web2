module.exports = function (req,res){
    if(!req.currentEmployee) {
        res.redirect('/employee');
    }    
    const employee=req.currentEmployee;
    res.render('employee/activity', { employee: employee });    
};
 