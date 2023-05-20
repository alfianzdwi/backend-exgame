const TransactionsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "transactions",
  version: "1.0.0",

  //Mendaftarkan Plugin      //Options
  register: async (server, { service }) => {
    const transactionhandler = new TransactionsHandler(service);
    server.route(routes(transactionhandler));
  },
};
