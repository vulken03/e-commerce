module.exports = (sequelize, Sequelize) => {
  const verification_token = sequelize.define("verification_token", {
    customer_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    token: {
      type: Sequelize.STRING,
    },
  });
  verification_token.associate = (models) => {
    verification_token.belongsTo(models.customer, {
      foreignKey: "customer_id",
    });
  };
  return verification_token;
};
