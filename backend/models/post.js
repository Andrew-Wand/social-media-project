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
    liked: {
      type: Sequelize.VIRTUAL,
      allowNull: false,
      defaultValue: false,
      get: function () {
        return this.getDataValue("likes")?.length ? true : false;
      },
    },
    likeCounts: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  });

  return Post;
};
