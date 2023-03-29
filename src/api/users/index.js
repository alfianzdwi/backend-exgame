const UsersHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "users",
  version: "1.0.0",

  //Mendaftarkan Plugin      //Options
  register: async (server, { service, validator }) => {
    const userhandler = new UsersHandler(service, validator);
    server.route(routes(userhandler));
  },
};
