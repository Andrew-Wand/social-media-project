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

db.users = require("../models/user")(sequelize, Sequelize);
db.posts = require("../models/post")(sequelize, Sequelize);

db.users.hasMany(db.posts, { as: "posts" });
db.posts.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
});
module.exports = db;
