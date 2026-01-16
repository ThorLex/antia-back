const express = require("express");

const authRoutes = require("./authRoutes");
const ClientRoutes = require("./clientRoutes");
const userRoutes = require("./userRoutes");
const agencyRoutes = require("./agencyRoutes");
const app = express();

app.get("/", (req, res) => {
  res.send("API is running");
});

// Use routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/agencies", agencyRoutes);
app.use("/clients", ClientRoutes);

module.exports = app;
