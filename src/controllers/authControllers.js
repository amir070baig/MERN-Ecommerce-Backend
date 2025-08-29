const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'})
}

// Register user
const registerUser = async (req, res) => {
  try{
    const {name, email, password} = req.body;
    const userExists = await User.findOne({email});
    if(userExists) return res.status(400).json({Message: "User already exists"});
    
    const user = await User.create({name, email, password});

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch(err){
    res.status(500).json({ message: err.message });
  }
};


// Login User
const loginUser = async (req, res) => {
  try{
    const {email, paswword} = req.body;
    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }else{
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch(err){
      res.status(500).json({ message: err.message });
  }
};

// Make Admin
const makeAdmin = async (req, res) => {
  try{
    const {userId} = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "Admin";
    await user.save();
      res.json({ message: `${user.name} is now an Admin` });
  } catch(err){
    res.status(500).json({ message: err.message });

  }
}

module.exports = { registerUser, loginUser, makeAdmin };
