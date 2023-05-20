const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const AuthorizationError = require("../../exceptions/AuthorizationError.js");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapGameDBToModel } = require("../../utils");

class GamesService {
  constructor() {
    this._pool = new Pool();
  }

  async addGame({ title }) {
    const id = `gm-${nanoid(16)}`;

    //Membuat objek query untuk memasukan games baru ke database
    const query = {
      text: "INSERT INTO games VALUES ($1, $2) RETURNING id_game",
      values: [id, title],
    };

    const result = await this._pool.query(query); //Untuk mengeksekusi query yang sudah dibuat

    //Mengevaluasi Menggunakan id Untuk Memastikan Data Sudah Berhasil Dimasukan Ke Database
    if (!result.rows[0].id_game) {
      throw new InvariantError("Games gagal ditambahkan");
    }

    return result.rows[0].id_game; //Untuk Mengembalikan Id
  }

  async getGames() {
    const query = {
      text: `SELECT * FROM games`,
    };

    const result = await this._pool.query(query); //Melakukan Query Lalu Hasilnya Di Masukkan Ke Dalam Variabel Result
    return result.rows.map(mapGameDBToModel); //Mengmebalikan Hasil Data Yang Di Dapat Lalu Di mapping,Dengan menggunakan berkas indek yang sudah kita buat di folder utils
  }

  async getGameById(id) {
    const query = {
      text: `SELECT * FROM games WHERE id_game = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Game tidak ditemukan");
    }

    return result.rows.map(mapGameDBToModel)[0];
  }

  async deleteGameById(id) {
    const query = {
      text: "DELETE FROM games WHERE id_game = $1 RETURNING id_game",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Game gagal dihapus. Id tidak ditemukan");
    }
  }
}

module.exports = GamesService;
