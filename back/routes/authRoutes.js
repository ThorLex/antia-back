const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  updateProfile,
  deleteAccount,
  verifyEmail,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/update-profile", updateProfile);
router.post("/delete-account", deleteAccount);
router.post("/verify-email", verifyEmail);

module.exports = router;
