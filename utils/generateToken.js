const jwt = require("jsonwebtoken")

function generateToken(email,id){
        const token =  jwt.sign({
        email : email,
        id : id
     },process.env.Secret_Key)
     return token;
}



module.exports = generateToken;

