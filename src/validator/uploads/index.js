const InvariantError = require("../../exceptions/InVariantError");
const { ImageHeadersSchema } = require("./schema");

const UploadsValidator = {
  validateImageHeader: (headers) => {
    const validationResult = ImageHeadersSchema.validate(headers);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UploadsValidator;
