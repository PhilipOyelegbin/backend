const Sequelize = require("sequelize");
const process = require("node:process")

process.loadEnvFile('.env');

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: "mysql",
    dialectOptions: {
      maxPreparedStatements: 100,
    },
  }
);

module.exports = sequelize;
