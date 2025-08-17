const Joi = require("joi");

// Middleware to validate input data
const    validateInput = (req, res, next) => {
  let schema;

  if (req.path === "/auth/register") {
    schema = Joi.object({
      name: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });
  } else if (req.path === "/auth/login") {
    schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });
  } else if (req.path === "/auth/update-profile") {
    schema = Joi.object({
      name: Joi.string().min(3),
      email: Joi.string().email(),
    });
  }

  if (schema) {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  }

  next();
};

module.exports = { validateInput };
