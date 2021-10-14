module.exports = (sequelize, Sequelize) => {
  const cart = sequelize.define("cart", {
    cart_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      notNull: true,
    },
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    customer_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    is_out_of_stock: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });
  cart.associate = (models) => {
    cart.belongsTo(models.product, {
      foreignKey: "product_id",
    }),
      cart.belongsTo(models.customer, {
        foreignKey: "customer_id",
      });
  };
  return cart;
};
