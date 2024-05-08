const db = require("../models");
const User = db.users;
const Follower = db.followers;
const Post = db.posts;
const { Op } = require("sequelize");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

// exports.findAllUsers = (userId) => {
//   return User.findByPk(userId)
//     .then((post) => {
//       return post;
//     })
//     .catch((err) => {
//       console.log(">> Error while finding user: ", err);
//     });
// };

exports.findUserById = async (req, res) => {
  const user = await User.findByPk(req.params.profileId, {
    include: [
      // "posts",
      {
        model: User,
        as: "userFollowers",
        // attributes: ["followerId"],
        through: {
          attributes: [],
        },
      },
      {
        model: Post,
        as: "posts",
        include: ["comments"],
      },
    ],
  });
  return res.send(user);
};

// exports.findUserById = (id) => {
//   return User.findByPk(id, {
//     include: [
//       {
//         model: Follower,
//         as: "followers",
//         attributes: ["id", "name"],
//         through: {
//           attributes: [],
//         },
//         // through: {
//         //   attributes: ["tag_id", "tutorial_id"],
//         // },
//       },
//     ],
//   })
//     .then((user) => {
//       return user;
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
    const response = await User.findAll({
      include: [
        {
          model: User,
          as: "userFollowers",
          // attributes: ["followerId"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    res.status(200).send(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};
exports.findMyFollowers = async (req, res) => {
  // return Post.findAll({ include: ["comments"] }).then((post) => {
  //   return post;
  // });

  try {
    const response = await User.findAll({
      include: [
        {
          model: User,
          as: "userFollowers",
          where: {
            id: req.body.id,
          },
          // attributes: ["followerId"],
          // through: {
          //   attributes: ["followerId"],
          // },
        },
      ],
    });

    res.status(200).send(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

exports.updateProfile = async (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Tutorial update successful!",
        });
      } else {
        res.send({
          message: `Cannot update Tutorial`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error updating!`,
      });
    });
};
