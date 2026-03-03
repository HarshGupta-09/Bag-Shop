require("dotenv").config()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const generateToken = require("../utils/generateToken")
const userModel = require("../models/userModel")
const { response } = require("express")

 const registerUser =  async (req,res)=>{
    const{ email , fullname , password } = req.body;
    try{
        const exist = await userModel.findOne({email})
        if (exist) {
         return res.status(400).json({
            message: "User with this email already exists"
         });
      }
      const hashPassword  = await bcrypt.hash(password,10) 
      const user = await userModel.create({
        email : email,
        fullname : fullname,
        password : hashPassword
      })
 const token = generateToken(email,user._id);

     res.cookie("token",token);

 res.status(201).json({
         message: "user created successfully",
         user
      });

    }
    catch (error){
        let message = error.message
        res.status(500).json({
            message : message,
           
        })

    }

}
async function  loginUser(req,res){
    const { email , password} = req.body;
    try{ 
         const isExist = await userModel.findOne({email});
       
    if(!isExist){
     return    res.status(400).json({
            message : "user with this email doesnt exist"
        })

    }
    const passwordMatch = await bcrypt.compare(password,isExist.password);
    
    if(passwordMatch){
        const token = generateToken(email,isExist._id);
         res.cookie("token",token);
     return res.redirect("/shop")
    
     

    }else{
          res.status(403).json({
            message : "invalid email or password"
        })
    }

  
    }
    catch(error){
        res.status(500).json({
            message : error.message
        })
    }

}
const logoutUser = async (req, res) => {
  res.clearCookie("token");

   req.flash("success", "Logged out successfully");

   return res.redirect("/");
};
module.exports = {registerUser ,
loginUser , logoutUser
};