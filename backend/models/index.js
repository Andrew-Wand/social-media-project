require("dotenv").config();
const Sequelize = require("sequelize");

const dbName = "socialmediaproject";
const sequelize = new Sequelize(
  dbName,
  process.env.VITE_DATABASE_USER,
  process.env.VITE_DATABASE_PASSWORD,
  {
    dialect: "postgres",
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user")(sequelize, Sequelize);
module.exports = db;
