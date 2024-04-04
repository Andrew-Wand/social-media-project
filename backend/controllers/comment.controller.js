const db = require("../models");
const Comment = db.comments;

// exports.createComment = (postId, userId, comment) => {
//   return Comment.create({
//     // comment_text: req.body.comment_text,
//     // postId: req.body.postId,
//     comment_text: comment.comment_text,
//     postId: postId,
//     userId: userId,
//   })
//     .then((post) => {
//       console.log("Created post: " + JSON.stringify(post, null, 4));

//       return post;
//     })
//     .catch((err) => {
//       console.log("Error while creating post: ", err);
//     });
// };
exports.createComment = (req, res) => {
  return Comment.create({
    // comment_text: req.body.comment_text,
    // postId: req.body.postId,
    comment_text: req.body.comment_text,
    postId: req.body.postId,
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
