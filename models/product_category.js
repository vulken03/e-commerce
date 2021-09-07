module.exports = (sequelize, Sequelize) => {
  const product_category = sequelize.define("product_category", {
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
  product_category.associate = (models) => {
    product_category.belongsToMany(models.product_type, {
      through: "type_category",
      foreignKey: "category_id",
      otherKey:"product_type_id"
    });
  };
  return product_category;
};
