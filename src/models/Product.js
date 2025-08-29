const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: "" }, // for product images (later Cloudinary)
    countInStock: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
