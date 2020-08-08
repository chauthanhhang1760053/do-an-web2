module.exports = function logout(req,res){
    req.session.userId=null;
    req.session=null;
    res.redirect('/');
};
