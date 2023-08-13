const { body } = require("express-validator");
const { Config } = require('../utils');
const BaseValidator = require("./BaseValidator");

class WalletValidator extends BaseValidator {
  static fiatDepositRules() {
    return [
      body('amount')
      .notEmpty()
      .withMessage('Deposit amount is required.')
      .isNumeric()
      .withMessage('Only numeric values allowed.')
      .custom((amount) => +amount > 0)
      .withMessage(`Deposit amount must be greater than 0.`)
    ]
  }
}

module.exports = WalletValidator;