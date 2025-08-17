const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const handlebarOptions = {
  viewEngine: {
    extname: ".hbs",
    partialsDir: path.resolve("./back/templates/"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./back/templates/"),
  extName: ".hbs",
};

transporter.use("compile", handlebarOptions);

module.exports = transporter;
