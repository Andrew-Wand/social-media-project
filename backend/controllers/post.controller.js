const db = require("../models");
const Post = db.posts;

exports.createPost = (req, res) => {
  return Post.create({
    Title: req.body.Title,
    Text: req.body.Text,
    userId: req.body.userId,
    owner: req.body.owner,
  })
    .then((post) => {
      console.log("Created post: " + JSON.stringify(post, null, 4));

      return post;
    })
    .catch((err) => {
      console.log("Error while creating post: ", err);
    });
};

exports.findPostById = (postId) => {
  return Post.findByPk(postId, { include: ["comments"] })
    .then((comment) => {
      return comment;
    })
    .catch((err) => {
      console.log(">> Error while finding tutorial: ", err);
    });
};

exports.findAllPosts = async (req, res) => {
  // return Post.findAll({ include: ["comments"] }).then((post) => {
  //   return post;
  // });

  try {
    const response = await Post.findAll({ include: ["comments"] });
    res.status(200).send(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

// exports.createPost = async (req, res) => {
//   const post = await Post.create({
//     Title: req.body.Title,
//     Text: req.body.Text,
//   });

//   await post.save();
//   res.send({ message: "User successfully registered!" });
// };
