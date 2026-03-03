const express = require("express");
const router = express.Router();
const ownerModel = require("../models/ownerModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require("../config/multerConfig");
const productModel = require("../models/productModel")
// Routes
router.get("/login", (req, res) => {
  return res.render("ownerLogin");
  // to do
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const owner = await ownerModel.findOne({ email });
    if (!owner) {
      return res.send("Owner not found with this email");
    }
    const match = await bcrypt.compare(password, owner.password);
    if (!match) {
      return res.send("Invalid pasword");
    }
    const token = jwt.sign(
      { id: owner._id, role: "owner" },
      process.env.Secret_Key,
      { expiresIn: "1d" },
    );
    res.cookie("ownerToken", token, {
      httpOnly: true,
    });
    return res.redirect("/owner/admin/dash");
  } catch (err) {
    return res.send(err.message);
  }
});
function isOwnerLoggedIn(req, res, next) {
  if (!req.cookies.ownerToken) {
    return res.redirect("/owner/login");
  }

  try {
    const decoded = jwt.verify(req.cookies.ownerToken, process.env.Secret_Key);
    req.owner = decoded;

    if (decoded.role !== "owner") {
      return res.redirect("/");
    }

    next();
  } catch (err) {
    return res.send(err.message);
  }
}

router.post(
  "/admin/add-product",
  isOwnerLoggedIn,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, price, discount, bgColor, panelColor, textColor } =
        req.body;
      const ownerId = jwt.verify(
        req.cookies.ownerToken,
        process.env.Secret_Key,
      ).id;
      // create product

      const product = await productModel.create({
         image : req.file.filename,
         name,
         price,
         discount,
         bgColor,
         panelColor,
         textColor
      })
      // pushing id into owners 
      await ownerModel.findByIdAndUpdate(ownerId,{
         $push : {products : product._id}
      })
      res.redirect("/owner/admin/dash")




    } catch (error) {
res.send(error.message)
    }
  },
);

router.get("/admin/dash", isOwnerLoggedIn, (req, res) => {
  res.render("adminDash");
});

// to show all products to owner
router.get("/admin/products", isOwnerLoggedIn, async(req, res) => {
 try {
    const decoded = jwt.verify(
      req.cookies.ownerToken,
      process.env.Secret_Key
    );

    const owner = await ownerModel
      .findById(decoded.id)
      .populate("products");

    res.render("adminProducts", { owner });
  } catch (err) {
    res.send(err.message);
  }

router.post("/admin/delete-product/:id",isOwnerLoggedIn,async (req,res)=>{
   try{
        const decoded = jwt.verify(
      req.cookies.ownerToken,
      process.env.Secret_Key
    );
    const ownerId = decoded.id;
    const productId = req.params.id;
    // delete
    await productModel.findByIdAndDelete(productId)
    // removing id fro owner
    await ownerModel.findByIdAndDelete(ownerId,{
        $pull: { products: productId }
    })
    res.redirect("/owner/admin/products")
   }
   catch(error){
res.send(error.message)
   }
})


});

module.exports = router;
