// mengimpor dotenv dan menjalankan konfigurasinya
require("dotenv").config();

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const path = require("path");
const Inert = require("@hapi/inert");

// users
const users = require("./api/users");
const UsersService = require("./services/postgres/UsersService");
const UsersValidator = require("./validator/users");

// authentications
const authentications = require("./api/authentications");
const AuthenticationsService = require("./services/postgres/AuthenticationsService");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationsValidator = require("./validator/authentications");

// games
const games = require("./api/games");
const GamesService = require("./services/postgres/GamesService");
const GamesValidator = require("./validator/games");

// products
const products = require("./api/products");
const ProductsService = require("./services/postgres/ProductsService");
const ProductsValidator = require("./validator/products");

// Uploads
const uploads = require("./api/uploads");
const StorageService = require("./services/storage/StorageService");
const UploadsValidator = require("./validator/uploads");

// transactions
const transactions = require("./api/payment");
const TransactionsService = require("./services/postgres/TransactionsService");

const init = async () => {
  //Membuat Instance Service
  const usersService = new UsersService();
  const gamesService = new GamesService();
  const productsService = new ProductsService();
  const transactionsService = new TransactionsService();
  const authenticationsService = new AuthenticationsService();
  const uploadsService = new StorageService(
    path.resolve(__dirname, "api/uploads/file/images")
  );

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert, // Inert: Plugin pihak ketiga yang dapat memudahkan kita dalam melayani permintaan menggunakan berkas
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy("skripsi_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: games,
      options: {
        service: gamesService,
        validator: GamesValidator,
      },
    },
    {
      plugin: products,
      options: {
        service: productsService,
        validator: ProductsValidator,
        uploadService: uploadsService,
        uploadValidator: UploadsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: uploadsService,
        validator: UploadsValidator,
        productsService: productsService,
        productsValidator: ProductsValidator,
      },
    },
    {
      plugin: transactions,
      options: {
        service: transactionsService,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
