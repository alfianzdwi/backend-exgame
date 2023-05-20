const ClientError = require("../../exceptions/ClientError");

class TransactionsHandler {
  constructor(service) {
    this._service = service;

    //Binding agar nilainya tetap instance dari TransactionsHandler dan nilai/konteks this tidak berubah
    this.postTransactionHandler = this.postTransactionHandler.bind(this);
    this.getTransactionsHandler = this.getTransactionsHandler.bind(this);
    this.deleteTransactionByIdHandler =
      this.deleteTransactionByIdHandler.bind(this);
  }

  async postTransactionHandler(request, h) {
    try {
      const { id, price, title } = request.payload; //Mengambil Body Request Dari Client
      const { id: owner } = request.auth.credentials;
      const transactionId = await this._service.addTransaction({
        id,
        price,
        owner,
        title,
      }); //Memanggil fungsi addTransaction dari this._service untuk memasukkan transaction baru dan mengembalikan id

      const response = h.response({
        status: "success",
        message: "Transaction berhasil ditambahkan",
        data: {
          transactionId,
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

  async getTransactionsHandler(request) {
    const { id: owner } = request.auth.credentials;
    const transactions = await this._service.getTransactions(owner);
    return {
      status: "success",
      data: {
        transactions,
      },
    };
  }

  async deleteTransactionByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteTransactionById(id);
      return {
        status: "success",
        message: "Transaction berhasil dihapus",
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

module.exports = TransactionsHandler;
