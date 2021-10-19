module.exports = (sequelize, Sequelize) => {
  const order = sequelize.define("order", {
    order_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      notNull: true,
    },
    customer_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    address_id: {
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
    gst: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    shipping_fee: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    subtotal: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });
  order.associate = (models) => {
    order.belongsTo(models.customer_address, {
      foreignKey: "address_id",
    }),
      order.belongsTo(models.customer, {
        foreignKey: "customer_id",
      });
  };
  return order;
};
