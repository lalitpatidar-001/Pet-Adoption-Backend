const { check, body, validationResult } = require("express-validator");

const loginValidationRules = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
];

const registerValidationRules = [
  body("email")
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Invalid email address"),

body("password")
  .notEmpty()
  .withMessage("Password is required")
  .isLength({ min: 6 , max:14 })
  .withMessage("Password must be  6 to 14 characters long"),

  body("username")
    .isString()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),

  
];

module.exports = {
  registerValidationRules,
  loginValidationRules,
};
