module.exports = (sequelize, Sequelize) => {
  const Message = sequelize.define("message", {
    text: {
      type: Sequelize.STRING,
    },
    owner: {
      type: Sequelize.STRING,
    },
    receiver: {
      type: Sequelize.STRING,
    },
  });

  // Message.associate = (models) => {
  //   Message.belongsTo(models.User);
  // };

  return Message;
};
