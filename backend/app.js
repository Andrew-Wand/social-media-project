const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const models = require("./models");
const controller = require("./controllers/post.controller");
const userController = require("./controllers/user.controller");
const commentController = require("./controllers/comment.controller");
const session = require("express-session");

const db = require("./models");

const app = express();
const bodyParser = require("body-parser");
app.use(
  session({
    secret: "my test secret",
    cookie: {},
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const run = async (req, res) => {
  // const post4 = await controller.createPost("2", {
  //   Title: "My first post teehee!",
  //   Text: "This will be my first woooo!",
  // });
  // const user1 = await userController.findUserById("1");
  // console.log(user1, JSON.stringify(user1, null, 2));

  // const comment1 = await commentController.createComment("2", "1", {
  //   comment_text: "This is the first comment!",
  // });
  const post1 = await controller.findPostById("1");
  console.log(post1, JSON.stringify(post1, null, 10));
};

db.sequelize.sync().then(() => {
  // run();
});

// set port, listen for requests
const PORT = process.env.VITE_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/post.routes")(app);
require("./routes/comment.routes")(app);

module.exports = app;
