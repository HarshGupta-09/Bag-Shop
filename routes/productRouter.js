const express = require("express")
const router = express.Router();

router.get("/",(req,res)=>{
    res.send("welcome to product route")
})

module.exports = router;