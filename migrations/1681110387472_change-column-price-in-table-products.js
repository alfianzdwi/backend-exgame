/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.alterColumn("products", "price", {
    type: "NUMERIC",
    notNull: true,
    using: "price::numeric",
  });
};

exports.down = (pgm) => {
  pgm.alterColumn("products", "price", {
    type: "TEXT",
    notNull: true,
  });
};
