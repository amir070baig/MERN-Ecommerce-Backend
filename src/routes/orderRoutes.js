const express = require("express");
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// Place new order → Logged-in user
router.post("/", protect, async (req, res) => {
  try {
    const order = new Order({
      user: req.user._id,
      ...req.body,
    });
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get logged-in user's orders
router.get("/myorders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all orders → Admin only
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
