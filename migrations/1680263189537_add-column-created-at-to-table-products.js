/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn("products", {
    created_at: {
      type: "TEXT",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("products", "created_at");
};
