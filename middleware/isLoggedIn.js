const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

async function isLoggedIn (req,res,next){
if(!req.cookies.token){
    req.flash("error","you need to be login first")
    return res.redirect('/')

}
try{
    let decoded = jwt.verify(req.cookies.token,process.env.Secret_Key);
    req.user = decoded;
    next();
}catch(error){
    req.flash("error","something went wrong")
   return  res.redirect("/")
}
}
module.exports = isLoggedIn;