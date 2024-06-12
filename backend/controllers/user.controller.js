const db = require("../models");
const User = db.users;
const Follower = db.followers;
const Post = db.posts;
const { Op } = require("sequelize");
const uploadFile = require("../middleware/upload/cloudinary");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.findUserById = async (req, res) => {
  const user = await User.findByPk(req.params.profileId, {
    include: [
      {
        model: User,
        as: "userFollowers",

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

exports.findAllUsers = async (req, res) => {
  try {
    const response = await User.findAll({
      include: [
        {
          model: User,
          as: "userFollowers",

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
  try {
    const response = await User.findAll({
      include: [
        {
          model: User,
          as: "userFollowers",
          where: {
            id: req.body.id,
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

exports.updateProfile = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await User.update(
      {
        email: req.body.email,
        about_me: req.body.about_me,
      },
      {
        where: { id: id },
      }
    );

    if (result == 1) {
      res.send({ message: "update successfull" });
    }
  } catch (error) {
    res.status(500).send({ message: "error uploading" });
  }
};

exports.updateProfilePic = async (req, res) => {
  const id = req.params.id;

  try {
    const upload = await uploadFile(req.file.path, "MyBlogPics");
    const result = await User.update(
      {
        image_url: upload.secure_url,
      },
      {
        where: { id: id },
      }
    );

    if (result == 1) {
      res.send({ message: "update successfull" });
    }
  } catch (error) {
    res.status(500).send({ message: "error uploading" });
  }
};
