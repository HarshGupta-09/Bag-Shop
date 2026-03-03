const express = require("express");
const router = express.Router();
const ownerModel = require("../models/ownerModel");
const productModel = require("../models/productModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require("../config/multerConfig");


router.get("/login", (req, res) => {
  res.render("ownerLogin");
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const owner = await ownerModel.findOne({ email });
    if (!owner) {
      return res.send("Owner not found with this email");
    }

    const match = await bcrypt.compare(password, owner.password);
    if (!match) {
      return res.send("Invalid password");
    }

    const token = jwt.sign(
      { id: owner._id, role: "owner" },
      process.env.Secret_Key,
      { expiresIn: "1d" }
    );

    res.cookie("ownerToken", token, { httpOnly: true });

    res.redirect("/owner/admin/dash");

  } catch (err) {
    res.send(err.message);
  }
});


function isOwnerLoggedIn(req, res, next) {
  const token = req.cookies.ownerToken;

  if (!token) {
    return res.redirect("/owner/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.Secret_Key);

    if (decoded.role !== "owner") {
      return res.redirect("/");
    }

    req.owner = decoded; 
    next();

  } catch (err) {
    res.redirect("/owner/login");
  }
}


// ADMIN DASHBOARD

router.get("/admin/dash", isOwnerLoggedIn, async (req, res) => {
  try {
    const owner = await ownerModel
      .findById(req.owner.id)
      .populate("products");

    res.render("adminDash", { owner });

  } catch (err) {
    res.send(err.message);
  }
});


router.post(
  "/admin/add-product",
  isOwnerLoggedIn,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, price, discount, bgColor, panelColor, textColor } = req.body;

      if (!req.file) {
        return res.send("Image is required");
      }

      // Create product
      const product = await productModel.create({
        image: req.file.filename,
        name,
        price,
        discount,
        bgColor,
        panelColor,
        textColor
      });

      // Push product id into owner
      await ownerModel.findByIdAndUpdate(req.owner.id, {
        $push: { products: product._id }
      });

      res.redirect("/owner/admin/products");

    } catch (error) {
      res.send(error.message);
    }
  }
);


router.get("/admin/products", isOwnerLoggedIn, async (req, res) => {
  try {
    const owner = await ownerModel
      .findById(req.owner.id)
      .populate("products");

    if (!owner) {
      return res.send("Owner not found");
    }

    res.render("adminProducts", { owner });

  } catch (err) {
    res.send(err.message);
  }
});



router.post("/admin/delete-product/:id", isOwnerLoggedIn, async (req, res) => {
  try {
    const productId = req.params.id;

    // Delete product
    await productModel.findByIdAndDelete(productId);

    // Remove reference from owner
    await ownerModel.findByIdAndUpdate(req.owner.id, {
      $pull: { products: productId }
    });

    res.redirect("/owner/admin/products");

  } catch (error) {
    res.send(error.message);
  }
});


module.exports = router;