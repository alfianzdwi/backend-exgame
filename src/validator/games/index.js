const InvariantError = require("../../exceptions/InVariantError");
const { GamePayloadSchema } = require("./schema");

const GamesValidator = {
  //Fungsi validateUserPayload untuk memvalidasi data payload (dari parameternya) berdasarkan UserPayloadSchema yang sudah kita buat di schema.js.
  validateGamePayload: (payload) => {
    const validationResult = GamePayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = GamesValidator;
