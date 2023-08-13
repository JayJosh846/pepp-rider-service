// Validate the signup data sent from the front-end

const Joi = require('joi');


const developersJoiSchema = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = (req, res, next) => {
  const { body: data } = req;
  console.log("Body of request", JSON.stringify(req.body));

  const validationResult = developersJoiSchema.validate(data);
  if (validationResult.error) {
    return res.status(400).json({
      status: "failed",
      message: validationResult.error.message,
      data: validationResult.error,
    });
  }

  return next();
};
