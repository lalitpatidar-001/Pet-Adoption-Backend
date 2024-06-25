const {check , validationResult} = require('express-validator');
// define validation rules
const postValidationRules = [
    check("type").optional().isString(),
    check('breed').optional().isString(),
    check('selectedGender').optional().isString(),
    check('ageValue').optional().isNumeric(),
    check('rangePrice').optional().isNumeric(),
    check('isNoFeeChecked').optional().isBoolean().withMessage("isNoFeeChecked must be a bool value")
  ];
  
  
  // check validation and hadle error
  

  module.exports = {
    postValidationRules,
  }