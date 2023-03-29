const ClientError = require("../../exceptions/ClientError");

class GamesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    //Binding agar nilainya tetap instance dari GamesHandler dan nilai/konteks this tidak berubah
    this.postGameHandler = this.postGameHandler.bind(this);
    this.getGamesHandler = this.getGamesHandler.bind(this);
    this.getGameByIdHandler = this.getGameByIdHandler.bind(this);
    this.deleteGameByIdHandler = this.deleteGameByIdHandler.bind(this);
  }

  async postGameHandler(request, h) {
    try {
      this._validator.validateGamePayload(request.payload);
      const { title } = request.payload; //Mengambil Body Request Dari Client

      const gameId = await this._service.addGame({
        title,
      }); //Memanggil fungsi addGame dari this._service untuk memasukkan game baru dan mengembalikan id

      const response = h.response({
        status: "success",
        message: "Game berhasil ditambahkan",
        data: {
          gameId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // SERVER ERROR
      const response = h.response({
        status: "fail",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getGamesHandler() {
    const games = await this._service.getGames();
    return {
      status: "success",
      data: {
        games,
      },
    };
  }

  async getGameByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const game = await this._service.getGameById(id);

      return {
        status: "success",
        data: {
          game,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        //Mengevaluasi Agar pesan error lebih spesifik dengan menggunakan jenis error yang sudah kita buat di folder exceptions
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // SERVER ERROR
      const response = h.response({
        status: "fail",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteGameByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteGameById(id);
      return {
        status: "success",
        message: "Game berhasil dihapus",
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: "fail",
        message: "Maaf, terjadi kegagalan pada server kami",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = GamesHandler;
