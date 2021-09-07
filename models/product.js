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
    },
    model_name: {
      type: Sequelize.STRING(60),
      allowNull: false,
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
  });
  return product;
};
