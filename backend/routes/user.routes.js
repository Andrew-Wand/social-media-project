const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

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

  // app.get("/test/all", controller.allAccess);

  app.get("/test/findAllUsers", controller.findAllUsers);
  app.get("/test/findProfileDataById/:profileId", controller.findUserById);
  app.post("/test/findMyFollowers", controller.findMyFollowers);
  app.put("/test/updateProfile/:id", controller.updateProfile);
};
