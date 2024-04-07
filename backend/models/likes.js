module.exports = (sequelize, Sequelize) => {
  const Likes = sequelize.define(
    "like",
    {
      total: {
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      postId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
    }
    // {
    //   indexes: [
    //     {
    //       fields: ["postId"],
    //     },
    //   ],
    // }
  );

  return Likes;
};
