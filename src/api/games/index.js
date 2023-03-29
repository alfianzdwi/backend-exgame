const GamesHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "games",
  version: "1.0.0",

  //Mendaftarkan Plugin      //Options
  register: async (server, { service, validator }) => {
    const gamehandler = new GamesHandler(service, validator);
    server.route(routes(gamehandler));
  },
};
