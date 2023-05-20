const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const AuthorizationError = require("../../exceptions/AuthorizationError.js");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapDBToModel } = require("../../utils");

class ProductsService {
  constructor() {
    this._pool = new Pool();
  }

  async addProduct(title, description, price, type, game, owner, imageUrl) {
    const createdAt = new Date().toISOString().substring(0, 10);
    const id = `pdc-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO products VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id_product",
      values: [
        id,
        title,
        description,
        price,
        imageUrl,
        type,
        game,
        owner,
        createdAt,
      ],
    };

    const result = await this._pool.query(query);

    //Mengevaluasi Menggunakan id Untuk Memastikan Data Sudah Berhasil Dimasukan Ke Database
    if (!result.rows[0].id_product) {
      throw new InvariantError("Produk gagal ditambahkan");
    }

    return result.rows[0].id_product; //Untuk Mengembalikan Id
  }

  async getProducts() {
    //Kueri ini akan mengembalikan seluruh nilai products yang dimiliki oleh dan dikolaborasikan dengan owner
    //Data products yang dihasilkan berpotensi duplikasi, sehingga di akhir kueri, kita GROUP nilainya agar menghilangkan duplikasi yang dilihat berdasarkan products.id.
    const query = {
      text: `SELECT products.*, games.title_game
            FROM products
            LEFT JOIN games ON products.game = games.id_game WHERE products.type_ads = $1`,
      values: ["Premium"],
    };

    const result = await this._pool.query(query); //Melakukan Query Lalu Hasilnya Di Masukkan Ke Dalam Variabel Result

    return result.rows.map(mapDBToModel); //Mengmebalikan Hasil Data Yang Di Dapat Lalu Di mapping,Dengan menggunakan berkas indek yang sudah kita buat di folder utils
  }

  async getProductsByGame(gameId) {
    //Kueri ini akan mengembalikan seluruh nilai products yang dimiliki oleh dan dikolaborasikan dengan owner
    //Data products yang dihasilkan berpotensi duplikasi, sehingga di akhir kueri, kita GROUP nilainya agar menghilangkan duplikasi yang dilihat berdasarkan products.id.
    const query = {
      text: `SELECT products.*, games.title_game
            FROM products
            LEFT JOIN games ON products.game = games.id_game
            WHERE game = $1`,
      values: [gameId],
    };

    const result = await this._pool.query(query); //Melakukan Query Lalu Hasilnya Di Masukkan Ke Dalam Variabel Result

    return result.rows.map(mapDBToModel); //Mengmebalikan Hasil Data Yang Di Dapat Lalu Di mapping,Dengan menggunakan berkas indek yang sudah kita buat di folder utils
  }

  async getProductsByGameAndPrice(gameId, rangeFrom, rangeTo) {
    const rangeFromNumber = Number(rangeFrom);
    const rangeToNumber = Number(rangeTo);
    //Kueri ini akan mengembalikan seluruh nilai products yang dimiliki oleh dan dikolaborasikan dengan owner
    //Data products yang dihasilkan berpotensi duplikasi, sehingga di akhir kueri, kita GROUP nilainya agar menghilangkan duplikasi yang dilihat berdasarkan products.id.
    const query = {
      text: `SELECT products.*, games.title_game
            FROM products
            LEFT JOIN games ON products.game = games.id_game
            WHERE game = $1 AND price BETWEEN $2 AND $3`,
      values: [gameId, rangeFromNumber, rangeToNumber],
    };

    const result = await this._pool.query(query); //Melakukan Query Lalu Hasilnya Di Masukkan Ke Dalam Variabel Result

    return result.rows.map(mapDBToModel); //Mengmebalikan Hasil Data Yang Di Dapat Lalu Di mapping,Dengan menggunakan berkas indek yang sudah kita buat di folder utils
  }

  async getMyProducts(owner) {
    const query = {
      text: `SELECT products.*, games.title_game
            FROM products
            LEFT JOIN games ON products.game = games.id_game
            WHERE products.owner = $1`,

      values: [owner],
    };

    const result = await this._pool.query(query); //Melakukan Query Lalu Hasilnya Di Masukkan Ke Dalam Variabel Result

    return result.rows.map(mapDBToModel); //Mengmebalikan Hasil Data Yang Di Dapat Lalu Di mapping,Dengan menggunakan berkas indek yang sudah kita buat di folder utils
  }

  async getProductById(id) {
    const query = {
      text: `SELECT products.*, users.username, users.contact, games.title_game
            FROM products
            LEFT JOIN users ON products.owner = users.id
            LEFT JOIN games ON products.game = games.id_game
            WHERE products.id_product = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Produk tidak ditemukan");
    }

    return result.rows.map(mapDBToModel)[0];
  }

  //Untuk Mendapatkan Berdasarkan Id,dan juga mendapatkan username dari hasil Join
  async getMyProductById(id) {
    const query = {
      //Kata FROM = Tabel Sebelah Kiri, Kata JOIN = Tabel Sebelah Kanan
      text: `SELECT products.*, users.username, users.contact, games.title_game
            FROM products
            LEFT JOIN users ON products.owner = users.id
            LEFT JOIN games ON products.game = games.id_game
            WHERE products.id_product = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Produk tidak ditemukan");
    }

    return result.rows.map(mapDBToModel)[0];
  }

  async editMyProductById(id, title, description, price, type, game, imageUrl) {
    const updateAt = new Date().toISOString();

    const query = {
      text: "UPDATE products SET title_product = $1,description = $2,price = $3, images = $4, type_ads = $5, game = $6 WHERE id_product = $7 RETURNING id_product",
      values: [title, description, price, imageUrl, type, game, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui produk. Id tidak ditemukan");
    }

    return result.rows[0].id_product;
  }

  async deleteMyProductById(id) {
    const query = {
      text: "DELETE FROM products WHERE id_product = $1 RETURNING id_product",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Produk gagal dihapus. Id tidak ditemukan");
    }
  }

  // Untuk memeriksa apakah catatan dengan id yang diminta adalah hak pengguna. Fungsi tersebut nantinya akan digunakan pada ProductsHandler sebelum mendapatkan, mengubah, dan menghapus catatan berdasarkan id.
  async verifyProductOwner(id, owner) {
    const query = {
      text: "SELECT * FROM products WHERE id_product = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    //Untuk mendapatkan objek product sesuai id; bila objek product tidak ditemukkan, maka throw NotFoundError
    if (!result.rows.length) {
      throw new NotFoundError("Products tidak ditemukan");
    }

    const product = result.rows[0];

    //Untuk Melakukan pengecekan kesesuaian owner-nya;  bila owner tidak sesuai, maka throw AuthorizationError.
    if (product.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  //Fungsi yang digunakan dalam menentukan hak akses user baik sebagai owner ataupun kolaborator,Fungsi verifyProductAccess bertujuan untuk memverifikasi hak akses pengguna (userId) terhadap catatan (id)
  async verifyProductAccess(productId, userId) {
    try {
      await this.verifyProductOwner(productId, userId); //Fungsi ini akan memeriksa hak akses Bila userId tersebut merupakan owner dari productId maka ia akan lolos verifikasi. Namun bila gagal, proses verifikasi owner membangkitkan eror (gagal) dan masuk ke block catch.
    } catch (error) {
      if (error instanceof NotFoundError) {
        // Bila error merupakan NotFoundError, maka langsung throw dengan error (NotFoundError) tersebut. Kita tak perlu memeriksa hak akses kolaborator karena catatannya memang tidak ada.
        throw error;
      }
    }
  }
}

module.exports = ProductsService;
