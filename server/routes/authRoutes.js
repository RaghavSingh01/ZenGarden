const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post("/register", register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", login);

// @route   POST /api/auth/password/forgot
// @desc    Forgot password - generate reset token
// @access  Public
router.post("/password/forgot", forgotPassword);

// @route   PUT /api/auth/password/reset/:resettoken
// @desc    Reset password with token
// @access  Public
router.put("/password/reset/:resettoken", resetPassword);

// @route   GET /api/auth/profile
// @desc    Get current user's profile
// @access  Private
router.get("/profile", protect, getProfile);

module.exports = router;