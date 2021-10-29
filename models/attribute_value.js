module.exports = (sequelize, Sequelize) => {
  const attribute_value = sequelize.define("attribute_value", {
    attribute_value: {
      type: Sequelize.STRING(40),
      allowNull: false,
      primaryKey: true,
    },
    attribute_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  });
  attribute_value.associate = (models) => {
    attribute_value.belongsTo(models.product_type_attribute, {
      foreignKey: "attribute_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };
  return attribute_value;
};
