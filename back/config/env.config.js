const dotenv = require("dotenv");
const path = require("path");

// Load environment variables based on the current NODE_ENV
const env = process.env.NODE_ENV || "DEV";
const envFile = path.resolve(__dirname, `../.env.${env}`);
dotenv.config({ path: envFile });

const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  superKey: process.env.SUPER_KEY,
  clientKey: process.env.CLIENT_KEY,
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

module.exports = config;
