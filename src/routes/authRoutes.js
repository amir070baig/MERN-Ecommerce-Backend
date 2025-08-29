const express = require("express");
const { registerUser, loginUser, makeAdmin } = require("../controllers/authControllers");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

router.post("/register", registerUser); // public
router.post("/login", loginUser);       // public

// Promote to Admin → only Admin can do this
router.put("/make-admin", protect, admin, makeAdmin);

module.exports = router;
