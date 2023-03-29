const Joi = require("joi");

const GamePayloadSchema = Joi.object({
  title: Joi.string().required(),
});

module.exports = { GamePayloadSchema };
