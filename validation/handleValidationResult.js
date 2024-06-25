const {validationResult} = require("express-validator");
/* 
handlePostValidationResult function :
    * Check error for body, params or query schemas definition
    * if error return all errors
    * if not pass request to next middleware
*/
const handlePostValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
    next();
  };


module.exports =handlePostValidationResult 