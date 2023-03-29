const routes = (handler) => [
  {
    method: "POST",
    path: "/games",
    handler: handler.postGameHandler,
  },
  {
    method: "GET",
    path: "/games",
    handler: handler.getGamesHandler,
  },
  {
    method: "GET",
    path: "/games/{id}",
    handler: handler.getGameByIdHandler,
  },
  {
    method: "DELETE",
    path: "/games/{id}",
    handler: handler.deleteGameByIdHandler,
  },
];

module.exports = routes;
