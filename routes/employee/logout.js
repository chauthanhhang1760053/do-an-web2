module.exports = function logout(req, res){
    req.session = null;
    res.redirect('/employee'); 
}