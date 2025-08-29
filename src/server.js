// 1. Import required modules
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// 2. Initialize express app
const app = express();

// 3. Load environment variables
dotenv.config();

// 4. Middlewares
app.use(express.json()); // allows JSON request body
app.use(cors()); // allows frontend to call backend

// 5. MongoDB connection using async/await
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // exit process if DB fails
  }
};

connectDB();

// 6. Simple test route
app.get("/", async (req, res) => {
  res.send("API is running...");
});

// Auth routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

// 7. Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
