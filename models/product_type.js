module.exports = (sequelize, Sequelize) => {
  const product_type = sequelize.define("product_type", {
    product_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      notNull: true,
    },
    product_type_name: {
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: true,
    },
  });
  product_type.associate = (models) => {
    product_type.belongsToMany(models.product_categories, {
      through: "type_categories",
      foreignKey: "product_id",
    });
    product_type.belongsToMany(models.product_brand, {
      through: "type_brand",
      foreignKey: "product_id",
    });
  };
  return product_type;
};
