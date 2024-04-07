const db = require("../models");
const User = db.users;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

// exports.findAllUsers = (userId) => {
//   return User.findByPk(userId, { include: ["posts"] })
//     .then((post) => {
//       return post;
//     })
//     .catch((err) => {
//       console.log(">> Error while finding user: ", err);
//     });
// };

exports.findAllUsers = async (req, res) => {
  // return Post.findAll({ include: ["comments"] }).then((post) => {
  //   return post;
  // });

  try {
    const response = await User.findAll();
    req.session.user = response;
    res.status(200).send(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};
