const routes = (handler) => [
  {
    method: "POST",
    path: "/products",
    handler: handler.postProductHandler, //Menggunakan fungsi yang merupakan member dari objek handler (parameter).
    options: {
      auth: "skripsi_jwt",
    },
  },
  {
    method: "GET",
    path: "/products",
    handler: handler.getProductsHandler,
    options: {
      auth: "skripsi_jwt",
    },
  },
  {
    method: "GET",
    path: "/myproducts",
    handler: handler.getMyProductsHandler,
    options: {
      auth: "skripsi_jwt",
    },
  },
  {
    method: "GET",
    path: "/products/{id}",
    handler: handler.getProductByIdHandler,
    options: {
      auth: "skripsi_jwt",
    },
  },
  {
    method: "GET",
    path: "/myproducts/{id}",
    handler: handler.getMyProductByIdHandler,
    options: {
      auth: "skripsi_jwt",
    },
  },
  {
    method: "PUT",
    path: "/myproducts/{id}",
    handler: handler.putMyProductByIdHandler,
    options: {
      auth: "skripsi_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/myproducts/{id}",
    handler: handler.deleteMyProductByIdHandler,
    options: {
      auth: "skripsi_jwt",
    },
  },
];

module.exports = routes;
