module.exports = (sequelize, Sequelize) => {
  const product_categories = sequelize.define("product_categories", {
    category_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      notNull: true,
    },
    category_name: {
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: true,
    },
  });
  product_categories.associate = (models) => {
    product_categories.belongsToMany(models.product_type, {
      through: "type_categories",
      foreignKey: "category_id",
    });
  };
  return product_categories;
};
