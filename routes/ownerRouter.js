const express = require("express")
const router = express.Router();
const ownerModel= require("../models/ownerModel")
const bcrypt = require("bcrypt")

router.get("/login",(req,res)=>{
    res.render("ownerLogin")
    // to do
})


router.post("/login" , (req,res)=>{
// to do
})

router.get("/owner/admin/dash",(req,res)=>{
   res.send("Admin Dashboard")
})



module.exports = router;