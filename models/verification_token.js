module.exports = (sequelize, Sequelize) => {
  const verification_token = sequelize.define("verification_token", {
    customer_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    token: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
  });
  verification_token.associate = (models) => {
    verification_token.belongsTo(models.customer, {
      foreignKey: "customer_id",
    });
  };
  return verification_token;
};
