//Berkas Ini Untuk Menyesuaikan Struktur/Variabel updated_At & images dengan cara mapping
const mapDBToModel = ({
  title_product,
  title_game,
  description,
  price,
  id_product,
  images,
  type_ads,
  username,
}) => ({
  title: title_product,
  game: title_game,
  description,
  price,
  id: id_product,
  images,
  type: type_ads,
  username,
});

const mapGameDBToModel = ({ id_game, title_game }) => ({
  id: id_game,
  title: title_game,
});

const mapUserDBToModel = ({ id, username, contact }) => ({
  id,
  username,
  contact,
});

module.exports = { mapDBToModel, mapUserDBToModel, mapGameDBToModel };
