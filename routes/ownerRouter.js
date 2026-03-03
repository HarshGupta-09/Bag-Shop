const express = require("express")
const router = express.Router();
const ownerModel= require("../models/ownerModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const upload = require("../config/multerConfig")

// Routes
router.get("/login",(req,res)=>{
  return   res.render("ownerLogin")
    // to do
})


router.post("/login" , async (req,res)=>{
   const { email , password } = req.body;
  try{
    const owner = await ownerModel.findOne({email})
   if(!owner){
      return res.send("Owner not found with this email")
   }
   const match = await bcrypt.compare(password,owner.password)
   if(!match){
      return res.send("Invalid pasword")

   }
  const token = jwt.sign(
         { id: owner._id, role: "owner" },
         process.env.Secret_Key,
         { expiresIn: "1d" }
      );
res.cookie("ownerToken", token,{
   httpOnly : true
})
return res.redirect("/owner/admin/dash")



  }catch(err){
return res.send(err.message)
  }
})
function isOwnerLoggedIn(req, res, next) {
   if (!req.cookies.ownerToken) {
      return res.redirect("/owner/login");
   }

   try {
      const decoded = jwt.verify(
         req.cookies.ownerToken,
         process.env.Secret_Key
      );

      if (decoded.role !== "owner") {
         return res.redirect("/");
      }

      next();

   } catch (err) {
      return res.send(err.message)
   }
}


router.post("/admin/add-product",isOwnerLoggedIn,upload.single("image"),async(req,res)=>{
  
})



router.get("/admin/dash",isOwnerLoggedIn,(req,res)=>{
   res.render("adminDash")
})

// to show all products to owner
router.get("/admin/products",isOwnerLoggedIn,(req,res)=>{
   return res.send("working")
})



module.exports = router;