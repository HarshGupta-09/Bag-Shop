require("dotenv").config();
const express = require("express")
const app = express();
const ownersRouter =require("./routes/ownerRouter")
const usersRouter =require("./routes/userRouter")
const productsRouter =require("./routes/productRouter")

const cookieParser = require("cookie-parser")
const path = require("path")

app.use(express.json())
app.use(express.urlencoded({ extended : true}));

app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))
app.set("view engine" , "ejs")
const db = require("./config/mongooseConnection")


// Routers
app.use("/owners",ownersRouter);
app.use("/users" ,usersRouter)
app.use("/products",productsRouter)







app.get("/" ,(req,res)=>{
res.send("Hello world")
})


const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server Running on PORT: ${PORT}`)
})