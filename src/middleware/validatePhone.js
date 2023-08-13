// Validate the signup data sent from the front-end

const Joi = require('joi');

const phoneJoiSchema = Joi.object().keys({
  phone: Joi.string().required()
});

module.exports = (req, res, next) => {
  const { body: data } = req;
  const validationResult = phoneJoiSchema.validate(data);
  if (validationResult.error) {
    return res.status(400).json({
      status: "failed",
      message: validationResult.error.message,
      data: validationResult.error,
    });
  }

  return next();
};
