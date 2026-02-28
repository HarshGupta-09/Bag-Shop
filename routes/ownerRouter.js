const express = require("express")
const router = express.Router();

router.get("/",(req,res)=>{
    res.send("welcome to owners route")
})

module.exports = router;