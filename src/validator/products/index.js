const InvariantError = require("../../exceptions/InvariantError");
const { ProductPayloadSchema } = require("./schema");

//Melakukan Validasi nya
const ProductsValidator = {
  validateProductPayload: (payload) => {
    const validationResult = ProductPayloadSchema.validate(payload);

    if (validationResult.error) {
      //Menggunakan Error Yang Sudah Di Buat Di Folder exceptions,agar response/status code nya lebih spesifik tidak general seperti pada saat menggunakan "Error"
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ProductsValidator;
