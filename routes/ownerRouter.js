const express = require("express")
const router = express.Router();
const ownerModel= require("../models/ownerModel")
const bcrypt = require("bcrypt")
router.get("/",(req,res)=>{
    res.send("welcome to owners route")
})

router.post("/create", async (req, res) => {
   try {
      const { email, fullname , password } = req.body;

      const existingOwner = await ownerModel.findOne({ email });

      if (existingOwner) {
         return res.status(400).json({
            message: "User with this email already exists"
         });
      }
      const hashPassword = await  bcrypt.hash(password,10)

      const newOwner = await ownerModel.create({
        fullname : fullname,
        email : email,
        password : hashPassword
      });

      res.status(201).json({
         message: "Owner created successfully",
         newOwner
      });

   } catch (error) {
      res.status(500).json({
         message: "Internal Server Error"
      });
   }
});

module.exports = router;