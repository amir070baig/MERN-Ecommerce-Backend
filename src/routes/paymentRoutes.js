const express = require("express");
const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const { protect } = require("../middleware/auth");
const Order = require("../models/Order");

const router = express.Router();

// @desc Create Razorpay order
// @route POST /api/payment/order
// @access Private
router.post("/order", protect, async (req, res) => {
  try {
    const { totalPrice } = req.body;

    const options = {
      amount: totalPrice * 100, // convert to paise
      currency: "INR",
      receipt: `order_rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc Verify payment signature (after success)
// @route POST /api/payment/verify
// @access Private
router.post("/verify", protect, async (req, res) => {
  try {
    const { orderId, paymentId, signature, dbOrderId } = req.body;

    const sign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (sign !== signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // ✅ Update our DB order as paid
    const order = await Order.findById(dbOrderId);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      await order.save();
    }

    res.json({ message: "Payment verified successfully", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
