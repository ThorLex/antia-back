const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const historyRoutes = require("./historyRoutes");
const notificationRoutes = require("./notificationRoutes");

const { validateInput } = require("../middlewares/validationMiddleware");

router.get("/", (req, res) => {
  res.send("API is running");
});

// Use routes
router.use("/auth", authRoutes);
router.use("/history", historyRoutes);
router.use("/notifications", notificationRoutes);

module.exports = router;
