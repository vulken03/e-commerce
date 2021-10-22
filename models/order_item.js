module.exports = (sequelize, Sequelize) => {
  const order_item = sequelize.define("order_item", {
    order_item_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      notNull: true,
    },
    product_id: {
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
    subtotal: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    order_detail_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });
  order_item.associate = (models) => {
    order_item.belongsTo(models.product, {
      foreignKey: "product_id",
    });
    order_item.belongsTo(models.order_detail, {
      foreignKey: "order_detail_id",
    });
  };
  return order_item;
};
