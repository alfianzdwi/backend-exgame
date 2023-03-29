const Joi = require("joi");

const UserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  contact: Joi.string().required(),
});

module.exports = { UserPayloadSchema };
