module.exports = (sequelize, Sequelize) => {
  const product_attribute_value = sequelize.define("product_attribute_value", {
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    attribute_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    value: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
  });
  product_attribute_value.associate = (models) => {
    product_attribute_value.belongsTo(models.product, {
      foreignKey: "product_id",
    });
    product_attribute_value.belongsTo(models.product_type_attribute, {
      foreignKey: "attribute_id",
    });
  };

  return product_attribute_value;
};
