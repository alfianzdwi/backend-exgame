/*Fungsi handler digunakan untuk menangani permintaan dari client yang datang 
kemudian memberikan respons dan sebaiknya memang hanya sebatas itu.*/

const ClientError = require("../../exceptions/ClientError");

class ProductsHandler {
  constructor(service, validator, uploadService, uploadValidator) {
    this._service = service;
    this._validator = validator;
    this._uploadService = uploadService;
    this._uploadValidator = uploadValidator;

    //Bind agar nilai this tidak berubah dari instance ProductsHandler, menjadi objek route yang memanggilnya karena sifat this pada javascript this akan berubah menjadi instance yang memanggilnya.
    this.postProductHandler = this.postProductHandler.bind(this);
    this.getProductsHandler = this.getProductsHandler.bind(this);
    this.getMyProductsHandler = this.getMyProductsHandler.bind(this);
    this.getProductByIdHandler = this.getProductByIdHandler.bind(this);
    this.getMyProductByIdHandler = this.getMyProductByIdHandler.bind(this);
    this.putMyProductByIdHandler = this.putMyProductByIdHandler.bind(this);
    this.deleteMyProductByIdHandler =
      this.deleteMyProductByIdHandler.bind(this);
  }

  async postProductHandler(request, h) {
    try {
      const { data, productData } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      const newData = JSON.parse(productData);
      const { title, description, price, type, game } = newData;

      this._validator.validateProductPayload(newData);
      this._uploadValidator.validateImageHeader(data.hapi.headers);

      const filename = await this._uploadService.writeFile(data, data.hapi);
      const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

      const product = await this._service.addProduct(
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

  async getProductsHandler() {
    const products = await this._service.getProducts();
    return {
      status: "success",
      data: {
        products,
      },
    };
  }

  async getMyProductsHandler(request) {
    const { id: credentialId } = request.auth.credentials; //Karena route /products menerapkan productsapp_jwt authentication strategy, maka setiap request.auth akan membawa nilai kembalian dari fungsi validate. Dengan begitu, kita bisa mendapatkan user id pengguna yang terautentikasi melalui request.auth.credentials.id.
    const products = await this._service.getMyProducts(credentialId);
    return {
      status: "success",
      data: {
        products,
      },
    };
  }

  async getProductByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const product = await this._service.getProductById(id);
      return {
        status: "success",
        data: {
          product,
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

      const response = h.response({
        status: "fail",
        message: "Maaf, terjadi kegagalan pada server kami",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getMyProductByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyProductAccess(id, credentialId); // Untuk Mengecek User Apakah Sebagai Owner
      const product = await this._service.getMyProductById(id);

      return {
        status: "success",
        data: {
          product,
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

      const response = h.response({
        status: "fail",
        message: "Maaf, terjadi kegagalan pada server kami",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async putMyProductByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { data, productData } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyProductAccess(id, credentialId);

      const newData = JSON.parse(productData);
      const { title, description, price, type, game } = newData;

      this._validator.validateProductPayload(newData);
      this._uploadValidator.validateImageHeader(data.hapi.headers);

      const filename = await this._uploadService.writeFile(data, data.hapi);
      const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
      const product = await this._service.editMyProductById(
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

  async deleteMyProductByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyProductOwner(id, credentialId);
      await this._service.deleteMyProductById(id);
      return {
        status: "success",
        message: "Product berhasil dihapus",
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

module.exports = ProductsHandler;
