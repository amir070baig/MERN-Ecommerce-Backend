const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminExists = await User.findOne({ email: "admin@example.com" });

    if (adminExists) {
      console.log("Admin already exists");
      process.exit();
    }

    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123", // 🔑 change after login
      role: "Admin",
    });

    console.log("Admin created:", admin.email);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
