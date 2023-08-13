const { param } = require('express-validator');
const BaseValidator = require('./BaseValidator');

class ParamValidator extends BaseValidator {
static RiderId = [
    param('riderId')
    .notEmpty()
    .withMessage('rider ID parameter is required.')
    .isNumeric()
    .withMessage('rider ID parameter must be numeric'),
    this.validate
  ]

  static TripId = [
    param('tripId')
    .notEmpty()
    .withMessage('rider ID parameter is required.')
    .isNumeric()
    .withMessage('rider ID parameter must be numeric'),
    this.validate
  ]

}



module.exports = ParamValidator;