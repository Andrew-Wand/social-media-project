const db = require("../models");
const Post = db.posts;
const Like = db.likes;
const User = db.users;
const Comment = db.comments;

exports.createPost = (req, res) => {
  return Post.create({
    Title: req.body.Title,
    Text: req.body.Text,
    userId: req.body.userId,
    owner: req.body.owner,
  })
    .then((post) => {
      console.log("Created post: " + JSON.stringify(post, null, 4));
      res.send(post);
      return post;
    })
    .catch((err) => {
      console.log("Error while creating post: ", err);
    });
};

// exports.findPostById = (postId) => {
//   return Post.findByPk(postId, { include: ["comments", "likes"] })
//     .then((comment) => {
//       return comment;
//     })
//     .catch((err) => {
//       console.log(">> Error while finding tutorial: ", err);
//     });
// };
exports.findPostById = async (req, res) => {
  const post = await Post.findByPk(req.params.postId, {
    include: ["comments"],
  });
  return res.send(post);
};

exports.findAllPosts = async (req, res) => {
  // return Post.findAll({ include: ["comments"] }).then((post) => {
  //   return post;
  // });

  try {
    const response = await Post.findAll({
      include: [
        { model: User, as: "user", attributes: ["username"] },
        { model: Comment, as: "comments" },
        // limit the likes based on the logged in user
        {
          model: Like,
          as: "likes",
          required: false,
          where: { userId: req.params.userId },
        },
      ],
      // include: ["comments", "likes"],
      order: [["createdAt", "ASC"]],
    });

    res.status(200).send(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

exports.createLike = async (req, res) => {
  // fetch created and post at the same time
  const [created, post] = await Promise.all([
    Like.findOne({
      where: {
        userId: req.body.userId,
        postId: req.body.postId,
      },
    }),
    Post.findOne({
      where: {
        id: req.body.postId,
      },
      order: [["createdAt", "ASC"]],
    }),
  ]);

  // no post, no updates
  if (!post) {
    return res.status(200).send({
      message: "there is no post to be liked",
    });
  }

  // we are going to make updates, so use a transaction, you will need to reference sequelize
  let transaction;
  try {
    transaction = await db.sequelize.transaction();

    if (!created && post) {
      // use Promise.all() for concurrency
      await Promise.all([
        Like.create(
          {
            total: req.body.total,
            userId: req.body.userId,
            postId: req.body.postId,
          },
          { transaction }
        ),
        post.increment("likeCounts", { by: 1, transaction }),
        post.update({ liked: req.body.userId ? true : false }, { transaction }),
      ]);

      await transaction.commit();

      return res.status(200).send({
        message: "You liked this post",
      });
    }

    await Promise.all([
      Like.destroy(
        {
          where: {
            userId: req.body.userId,
            postId: req.body.postId,
          },
        },
        { transaction }
      ),
      post.decrement("likeCounts", { by: 1, transaction }),
    ]);

    await transaction.commit();

    return res.status(200).send({
      message: "You unliked this post",
    });
  } catch (err) {
    if (transaction) {
      await transaction.rollback();
    }
    console.log("There was an error", err);
    return res.status(500);
  }

  // return Like.create({
  //   total: req.body.total,
  //   postId: req.body.postId,
  //   userId: req.body.userId,
  // })
  //   .then((post) => {
  //     console.log("Created like: " + JSON.stringify(post, null, 4));
  //     res.send(post);
  //     return post;
  //   })
  //   .catch((err) => {
  //     console.log("Error while creating post: ", err);
  //   });
};

// exports.getAllLikes = async (req, res) => {
//   try {
//     console.log(req.session.users);
//     const response = await Like.findAll({
//       where: {
//         userId: 2,
//       },
//     });
//     res.status(200).send(response);
//     return response;
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.incrementResult = async (req, res) => {
//   const post = await Post.findByPk("2");
//   let result = await Post.increment("likes", {
//     where: { id: post.id },
//   });
//   res.send(result);
//   return result;
// };

// exports.createPost = async (req, res) => {
//   const post = await Post.create({
//     Title: req.body.Title,
//     Text: req.body.Text,
//   });

//   await post.save();
//   res.send({ message: "User successfully registered!" });
// };
