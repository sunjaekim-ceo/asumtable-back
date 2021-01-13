const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  development: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "asum_developmentdb",
    host: "localhost",
    port: "3306",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "asum_testdb",
    host: "localhost",
    port: "3306",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "asum_productiondb",
    host: "localhost",
    port: "3306",
    dialect: "mysql",
  },
};
