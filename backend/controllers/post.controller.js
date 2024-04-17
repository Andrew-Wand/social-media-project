const db = require("../models");
const Post = db.posts;
const Like = db.likes;
const User = db.users;
const Comment = db.comments;
const Follower = db.followers;

const { Op } = require("sequelize");
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
    include: ["comments", "likes"],
  });
  return res.send(post);
};

exports.getAllPosts = async (req, res) => {
  try {
    const response = await Promise.all([
      await Post.findAll({
        include: [
          { model: Comment, as: "comments" },
          // limit the likes based on the logged in user
          {
            model: Like,
            as: "likes",
            required: false,
            where: { userId: req.params.userId },
          },
        ],
        order: [["createdAt", "ASC"]],
      }),
    ]);

    const newArr = await response.flatMap((x) => x);

    res.status(200).send(newArr);
    // console.log(post);
    // return followed;
  } catch (error) {
    console.log(error);
  }
};
exports.getMyHomeFeed = async (req, res) => {
  // return Post.findAll({ include: ["comments"] }).then((post) => {
  //   return post;
  // });

  try {
    const response = await Promise.all([
      // await Post.findAll({
      //   include: [
      //     {
      //       model: User,
      //       as: "user",
      //       attributes: ["username"],
      //       include: "userFollowers",
      //     },
      //     { model: Comment, as: "comments" },
      //     // limit the likes based on the logged in user
      //     {
      //       model: Like,
      //       as: "likes",
      //       required: false,
      //       where: { userId: req.params.userId },
      //     },
      //   ],
      //   // include: ["comments", "likes"],
      //   order: [["createdAt", "ASC"]],
      // }),

      await Follower.findAll({
        attributes: ["followerId"],
        where: {
          userId: req.params.userId,
        },
      }),
    ]);

    const newArr = response.flatMap((x) => x);

    const result = newArr.map((x) => x.followerId);

    const findPost = await Post.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username"],
          include: "userFollowers",
        },
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
      where: {
        [Op.or]: [{ userId: result }, { userId: req.params.userId }],
      },
    });

    res.status(200).send(findPost);
    // console.log(post);
    // return followed;
  } catch (error) {
    console.log(error);
  }
};
// exports.getMyFeed = async (req, res) => {
//   try {
//     const [user] = await Promise.all([
//       Follower.findAll(),
//       // Post.findAll({
//       //   include: [
//       //     { model: User, as: "user", attributes: ["username", "userFollowers"] },
//       //     { model: Comment, as: "comments" },
//       //     // limit the likes based on the logged in user
//       //     {
//       //       model: Like,
//       //       as: "likes",
//       //       required: false,
//       //       where: { userId: req.params.userId },
//       //     },
//       //   ],
//       //   // include: ["comments", "likes"],
//       //   order: [["createdAt", "ASC"]],
//       //   where: {},
//       // }),
//     ]);

//     res.status(200).send(user);
//     return user;
//   } catch (error) {
//     console.log(error);
//   }
// };

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
};
