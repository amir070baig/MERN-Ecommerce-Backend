const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// Create product → Admin only
router.post("/", protect, admin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all products → Public
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update product → Admin only
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete product → Admin only
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
