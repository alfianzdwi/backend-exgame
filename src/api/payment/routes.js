const routes = (handler) => [
  {
    method: "POST",
    path: "/transactions",
    handler: handler.postTransactionHandler,
    options: {
      auth: "skripsi_jwt",
    },
  },
  {
    method: "GET",
    path: "/transactions",
    handler: handler.getTransactionsHandler,
    options: {
      auth: "skripsi_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/transactions/{id}",
    handler: handler.deleteTransactionByIdHandler,
    options: {
      auth: "skripsi_jwt",
    },
  },
];

module.exports = routes;
