require("dotenv").config();
const express = require("express");
const app = express();
const ownersRouter = require("./routes/ownerRouter");
const usersRouter = require("./routes/userRouter");
const productsRouter = require("./routes/productRouter");
const cookieParser = require("cookie-parser");
const path = require("path");
const indexRouter = require("./routes/index");
const flash = require("connect-flash")
const expressSession = require("express-session")

// Middlewares
app.use(
  expressSession({
    resave : false,
    saveUninitialized:false,
    secret : process.env.EXPRESS_SESSION_SECRET
  })
)
app.use(flash())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
const db = require("./config/mongooseConnection");
// Routers
app.use("/owner", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/", indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Running on PORT: ${PORT}`);
});
