const ProductsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "products",
  version: "1.0.0", //Parameter kedua adalah options. Parameter ini dapat menampung nilai-nilai yang dibutuhkan dalam menggunakan plugin
  register: async (server, { service, validator }) => {
    const productsHandler = new ProductsHandler(service, validator); //Menginstance Berkas ProductsService Untuk Nanti di taruh sebagai nilai dari parameter routes
    server.route(routes(productsHandler)); //Mendaftarkan routes yang sudah kita buat pada server Hapi
  },
};
