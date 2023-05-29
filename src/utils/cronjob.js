const cron = require("node-cron");
const ProductsService = require("../services/postgres/ProductsService");

const productsService = new ProductsService();

const cronJob = () => {
  //ekspresi jadwal 0 0 * * * berarti tugas akan dijalankan pada pukul 00:0 (0:00 PM) setiap hari.
  cron.schedule("0 1 * * *", async () => {
    try {
      await productsService.deleteOldProducts();
      console.log("Old data deleted successfully.");
    } catch (error) {
      console.error("Error deleting old data:", error);
    }
  });
};

module.exports = cronJob;
