module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("post", {
    Title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    Text: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    owner: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Post;
};
