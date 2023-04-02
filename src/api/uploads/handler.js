const ClientError = require("../../exceptions/ClientError");

class UploadsHandler {
  constructor(service, validator, productsService, productsValidator) {
    this._service = service;
    this._productsService = productsService;
    this._validator = validator;
    this._productsValidator = productsValidator;

    this.putUploadImageHandler = this.putUploadImageHandler.bind(this);
    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
    this.postUploadImageHandlerWithUpdate =
      this.postUploadImageHandlerWithUpdate.bind(this);
  }

  //Menambahkan Gambar Bersamaan Dengan Data Lainnya
  async postUploadImageHandler(request, h) {
    try {
      const { data, productData } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      const newData = JSON.parse(productData);
      const { title, description, price, type, game } = newData;

      this._productsValidator.validateProductPayload(newData);
      this._validator.validateImageHeader(data.hapi.headers);

      const filename = await this._service.writeFile(data, data.hapi);
      const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

      const product = await this._productsService.addProduct(
        title,
        description,
        price,
        type,
        game,
        credentialId,
        fileLocation
      );
      const response = h.response({
        status: "success",
        messsage: "",
        data: {
          fileLocation: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
          product, // Fungsi writeFile mengembalikan nama berkas (filename). Kita bisa memanfaatkan nama berkas ini dalam membuat nilai fileLocation dan mengembalikannya sebagai response.
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

      // Server ERROR!
      const response = h.response({
        status: "fail",
        message: "Maaf, terjadi kegagalan pada server kami",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  //Mengubah Gambar Bersamaan Dengan Data Lainnya
  async putUploadImageHandler(request, h) {
    try {
      const { id } = request.params;
      const { data, productData } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._productsService.verifyProductAccess(id, credentialId);

      const newData = JSON.parse(productData);
      const { title, description, price, type, game } = newData;

      this._productsValidator.validateProductPayload(newData);
      this._validator.validateImageHeader(data.hapi.headers);

      const filename = await this._service.writeFile(data, data.hapi);
      const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
      const product = await this._productsService.editMyProductById(
        id,
        title,
        description,
        price,
        type,
        game,
        fileLocation
      );
      const response = h.response({
        status: "success",
        messsage: "",
        data: {
          fileLocation: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
          product, // Fungsi writeFile mengembalikan nama berkas (filename). Kita bisa memanfaatkan nama berkas ini dalam membuat nilai fileLocation dan mengembalikannya sebagai response.
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

      // Server ERROR!
      const response = h.response({
        status: "fail",
        message: "Maaf, terjadi kegagalan pada server kami",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  //Menambahkan Gambar Tidak Bersamaan Dengan Data Lainnya
  async postUploadImageHandlerWithUpdate(request, h) {
    try {
      const { data } = request.payload;
      const { id } = request.params;
      console.log(id);
      this._validator.validateImageHeader(data.hapi.headers);
      const filename = await this._service.writeFile(data, data.hapi);
      const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
      const productId = await this._productsService.addProductImage(
        id,
        fileLocation
      );
      const response = h.response({
        status: "success",
        messsage: "",
        data: {
          productId, // Fungsi writeFile mengembalikan nama berkas (filename). Kita bisa memanfaatkan nama berkas ini dalam membuat nilai fileLocation dan mengembalikannya sebagai response.
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

      // Server ERROR!
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

module.exports = UploadsHandler;
