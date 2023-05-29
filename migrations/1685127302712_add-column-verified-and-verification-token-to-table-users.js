/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn("users", {
    verified: { type: "boolean", notNull: true, default: false },
    verification_token: { type: "varchar(255)" },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("users", "verified");
  pgm.dropColumn("users", "verification_token");
};
