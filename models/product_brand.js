module.exports = (sequelize, Sequelize) => {
  const product_brand = sequelize.define("product_brand", {
    brand_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      notNull: true,
    },
    brand_name: {
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: true,
    },
  });
  product_brand.associate = (models) => {
    product_brand.belongsToMany(models.product_type, { through: "type_brand",foreignKey:'brand_id'});
  };
  return product_brand;
};
