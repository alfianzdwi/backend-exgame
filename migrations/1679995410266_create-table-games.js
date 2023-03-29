/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("games", {
    id_game: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    title_game: {
      type: "TEXT",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("games");
};
