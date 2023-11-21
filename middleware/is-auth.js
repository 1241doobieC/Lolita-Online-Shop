module.exports = (req, res, next) =>{
    if(!req.session.isLoggedIn){
        return res.redirct('/login')
    }
    next();
}