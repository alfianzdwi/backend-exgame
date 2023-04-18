const Joi = require("joi");

//Membuat SchemaNya
const ProductPayloadSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  images: Joi.string(),
  type: Joi.string(),
  game: Joi.string(),
});

module.exports = { ProductPayloadSchema };
