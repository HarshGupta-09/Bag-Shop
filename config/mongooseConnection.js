const mongoose = require("mongoose")


mongoose.connect("mongodb://localhost:27017/bag-shop").then(()=>{
  console.log("Database Connected")  
}).catch((err)=>{
    console.log(err)
})


module.exports = mongoose.connection;
