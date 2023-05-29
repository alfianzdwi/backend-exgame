const routes = (handler) => [
  {
    method: "POST",
    path: "/users",
    handler: handler.postUserHandler,
  },
  {
    method: "PUT",
    path: "/users/{id}",
    handler: handler.putUserByIdHandler,
  },
  {
    method: "GET",
    path: "/users/{id}",
    handler: handler.getUserByIdHandler,
    options: {
      auth: "skripsi_jwt",
    },
  },
  {
    method: "GET",
    path: "/users",
    handler: handler.getUsersByUsernameHandler,
  },
  {
    method: "GET",
    path: "/verify",
    handler: handler.verifyUserAccount,
  },
];

module.exports = routes;
