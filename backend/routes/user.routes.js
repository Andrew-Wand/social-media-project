const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const upload = require("../middleware/upload/multer.middleware");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    res.header("Content-Type", "multipart/form-data");
    next();
  });

  app.get("/test/findAllUsers", controller.findAllUsers);
  app.get("/test/findProfileDataById/:profileId", controller.findUserById);
  app.post("/test/findMyFollowers", controller.findMyFollowers);
  app.post(
    "/test/updateProfile/:id",
    upload.single("file"),
    controller.updateProfile
  );
};
