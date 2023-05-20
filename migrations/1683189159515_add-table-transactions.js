/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("transactions", {
    id_transaction: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    price: {
      type: "NUMERIC",
      notNull: true,
      using: "price::numeric",
    },
    owner: {
      type: "VARCHAR(50)",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("transactions");
};
