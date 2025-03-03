const Joi = require('joi');

// Validation for register
const registerValidation = Joi.object({
  name:Joi.string(),
  username: Joi.string()
    .min(4)
    .max(15)
    .required()
    .pattern(/^\S+$/)
    .messages({
      'string.min': 'Username must be at least 4 characters long.',
      'string.max': 'Username must not exceed 15 characters.',
      'string.empty': 'Username is required.',
      'string.pattern.base': 'Username must not contain spaces.',
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address.',
      'string.empty': 'Email is required.',
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long.',
      'string.empty': 'Password is required.',
    }),
    confirmpassword: Joi.string()
    .valid(Joi.ref("password")) // Ensure it matches password
    .required()
    .messages({
      "any.only": "Passwords must match.",
      "string.empty": "Confirm password is required.",
    }),

  isAdmin: Joi.boolean()

})

module.exports = {registerValidation};