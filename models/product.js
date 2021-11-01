module.exports = (sequelize, Sequelize) => {
  const product = sequelize.define("product", {
    product_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      notNull: true,
    },
    product_name: {
      type: Sequelize.STRING(60),
      allowNull: false,
      unique: "uniqueSelectedItem",
    },
    model_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: "uniqueSelectedItem",
    },
    product_description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
      min: 5000,
      max: 200000,
    },
    product_type_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    brand_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });
  product.associate = (models) => {
    product.hasMany(models.product_attribute_value, {
      foreignKey: "product_id",
    });
    product.belongsTo(models.product_type, { foreignKey: "product_type_id" });
    product.belongsTo(models.product_brand, { foreignKey: "brand_id" });
    product.hasMany(models.cart, { foreignKey: "product_id" });
    product.hasMany(models.order_item, { foreignKey: "product_id" });
    product.belongsTo(models.master_model, {
      foreignKey: { name: "model_id", unique: "uniqueSelectedItem" },
    });
  };
  return product;
};
