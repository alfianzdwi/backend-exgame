const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapUserDBToModel } = require("../../utils");
const AuthenticationError = require("../../exceptions/AuthenticationError");

class UsersService {
  constructor() {
    this._pool = new Pool();

    this._transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  // Fungsi untuk mengirim email verifikasi
  async sendVerificationEmail(email, verificationToken) {
    const emailOptions = {
      from: "exgame2023@gmail.com",
      to: email,
      subject: "Verifikasi Akun",
      text: `Klik link berikut untuk verifikasi akun Anda: http://13.229.130.75:5000/verify?token=${verificationToken}`,
    };
    console.log("Terkirim", email);
    console.log(new Date());
    try {
      await this._transporter.sendMail(emailOptions);
      console.log("Verification email sent to", email);
      console.log(new Date());
    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  }

  async verifyUserAccount(token) {
    const query = {
      text: "UPDATE users SET verified = true, verification_token = NULL WHERE verification_token = $1 RETURNING id",
      values: [token],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("User gagal ditambahkan");
    }
    return result.rows[0].id;
  }

  //Function Menambahkan User
  async addUser({ username, password, contact, email }) {
    // Untuk Verifikasi username, pastikan belum terdaftar.
    await this.verifyNewUsername(username, email);

    // Bila verifikasi lolos, maka masukkan user baru ke database.
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(20).toString("hex");

    const query = {
      text: "INSERT INTO users (id, username, password, contact, email, verification_token) VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
      values: [id, username, hashedPassword, contact, email, verificationToken],
    };

    const result = await this._pool.query(query);

    //Mengevaluasi Menggunakan lenght Untuk Memastikan Data Sudah Berhasil Dimasukan Ke Database
    if (!result.rows.length) {
      throw new InvariantError("User gagal ditambahkan");
    }

    // Kirim email verifikasi
    this.sendVerificationEmail(email, verificationToken);
    return result.rows[0].id; //Untuk Mengembalikan Id
  }

  // Function Verifikasi Username,Untuk Mengecek Username Sudah Digunakan Atau Belum
  async verifyNewUsername(username, email) {
    const query = {
      text: "SELECT username, email FROM users WHERE username = $1 OR email = $2",
      values: [username, email],
    };

    const result = await this._pool.query(query);

    // Mengecek Menggunakan Lenght,Jika Nilai Lebih Dari 0 Artinya Sudah Ada,Dan Akan Membangkitkan Error
    if (result.rows.length > 0) {
      const existingUser = result.rows[0];
      if (existingUser.username === username) {
        throw new InvariantError(
          "Gagal menambahkan user. Username sudah digunakan."
        );
      }
      if (existingUser.email === email) {
        throw new InvariantError(
          "Gagal menambahkan user. Email sudah digunakan."
        );
      }
    }
  }

  //Funtion Untuk Mendapatkan User Berdasarkan id
  async getUserById(userId) {
    const query = {
      text: "SELECT * FROM users WHERE id = $1",
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }
    return result.rows.map(mapUserDBToModel)[0];
  }

  async editUserById(id, password, contact, email) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: "UPDATE users SET password = $1,contact = $2,email = $3 WHERE id = $4 RETURNING id",
      values: [hashedPassword, contact, email, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui user. Id tidak ditemukan");
    }

    return result.rows[0].id;
  }

  //Function Verifikasi Username Dan Password Untuk Nanti Mendapatkan Token
  async verifyUserCredential(username, password) {
    const query = {
      text: "SELECT id, password, verified FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError("Kredensial yang Anda berikan salah");
    }

    // Untuk komparasi nilai hashedPassword dengan password yang ada di parameter
    const { id, password: hashedPassword, verified } = result.rows[0];

    //Untuk melakukan komparasi nilai string plain dan hashed menggunakan bcrypt,Karena hashedPassword nilainya sudah di-hash kita dapat memanfaatkan fungsi bcrypt.compare.
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError("Kredensial yang Anda berikan salah");
    }

    if (!verified) {
      throw new AuthenticationError(
        "Akun anda belum terverifikasi, Mohon cek email"
      );
    }

    return id; // Nilai user id tersebut nantinya akan digunakan dalam membuat access token dan refresh token.
  }

  //Untuk mendapatkan id users berdasarkan query parameter username.
  async getUsersByUsername(username) {
    const query = {
      text: "SELECT id, username, contact FROM users WHERE username LIKE $1", //Operator Like  untuk mencari record atau baris pada sebuah tabel, dimana kolom atau field yang dicari sesuai dengan pola (pattern) yang telah ditentukan.
      values: [`%${username}%`],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = UsersService;
