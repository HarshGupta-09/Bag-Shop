const express = require("express")
const router = express.Router();
const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
router.get("/",(req,res)=>{
    res.send("welcome to users route")
})
router.post("/register", async (req,res)=>{
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
     const token =  jwt.sign({
        email : email,
        id : user._id
     },process.env.Secret_Key)
     res.cookie("token",token);
     
 res.status(201).json({
         message: "user created successfully",
         user
      });

    }
    catch (error){
        res.status(500).json({
            message : "Internal serve error"
        })

    }

})


router.post("/login",(req,res)=>{
   
})

module.exports = router;