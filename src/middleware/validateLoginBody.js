// Validate the signup data sent from the front-end

const Joi = require('joi');

const loginJoiSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = (req, res, next) => {
  const { body: data } = req;
  console.log("Body of request", JSON.stringify(req.body));

  const validationResult = loginJoiSchema.validate(data);
  if (validationResult.error) {
    return res.status(400).json({
      status: "failed",
      message: validationResult.error.message,
      data: validationResult.error,
    });
  }

  return next();
};
