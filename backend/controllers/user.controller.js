const db = require("../models");
const User = db.users;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.findUserById = (userId) => {
  return User.findByPk(userId, { include: ["posts"] })
    .then((post) => {
      return post;
    })
    .catch((err) => {
      console.log(">> Error while finding tutorial: ", err);
    });
};
