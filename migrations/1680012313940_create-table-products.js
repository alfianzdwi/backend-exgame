/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("products", {
    id_product: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    title_product: {
      type: "TEXT",
      notNull: true,
    },
    description: {
      type: "TEXT",
      notNull: true,
    },
    price: {
      type: "TEXT",
      notNull: true,
    },
    images: {
      type: "VARCHAR(255)",
    },
    type_ads: {
      type: "VARCHAR(50)",
    },
    game: {
      type: "VARCHAR(50)",
    },
    owner: {
      type: "VARCHAR(50)",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("products");
};
