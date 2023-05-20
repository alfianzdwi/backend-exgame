const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const AuthorizationError = require("../../exceptions/AuthorizationError.js");
const InvariantError = require("../../exceptions/InvariantError.js");
const NotFoundError = require("../../exceptions/NotFoundError.js");
const { mapTransactionDBToModel } = require("../../utils/index.js");

class TransactionsService {
  constructor() {
    this._pool = new Pool();
  }

  async addTransaction({ id, price, owner, title }) {
    //Membuat objek query untuk memasukan transactions baru ke database
    const query = {
      text: "INSERT INTO transactions VALUES ($1, $2, $3, $4) RETURNING id_transaction",
      values: [id, price, owner, title],
    };

    const result = await this._pool.query(query); //Untuk mengeksekusi query yang sudah dibuat

    //Mengevaluasi Menggunakan id Untuk Memastikan Data Sudah Berhasil Dimasukan Ke Database
    if (!result.rows[0].id_transaction) {
      throw new InvariantError("Transactions gagal ditambahkan");
    }

    return result.rows[0].id_transaction; //Untuk Mengembalikan Id
  }

  async getTransactions(owner) {
    const query = {
      text: `SELECT transactions.* FROM transactions
            WHERE transactions.owner = $1`,

      values: [owner],
    };

    const result = await this._pool.query(query); //Melakukan Query Lalu Hasilnya Di Masukkan Ke Dalam Variabel Result
    return result.rows.map(mapTransactionDBToModel); //Mengmebalikan Hasil Data Yang Di Dapat Lalu Di mapping,Dengan menggunakan berkas indek yang sudah kita buat di folder utils
  }

  async deleteTransactionById(id) {
    const query = {
      text: "DELETE FROM transactions WHERE id_transaction = $1 RETURNING id_transaction",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Transaction gagal dihapus. Id tidak ditemukan");
    }
  }
}

module.exports = TransactionsService;
