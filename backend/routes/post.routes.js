const controller = require("../controllers/post.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/test/create-post", controller.createPost);

  app.get("/test/getAllPosts/:userId", controller.findAllPosts);
  app.get("/test/post/:postId", controller.findPostById);
  app.post("/test/create-like", controller.createLike);
  // app.get("/test/getLikes", controller.getAllLikes);
};
