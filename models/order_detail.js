module.exports = (sequelize, Sequelize) => {
  const order_detail = sequelize.define("order_detail", {
    order_detail_id: {
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
    order_status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    purchase_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
  order_detail.associate = (models) => {
    order_detail.belongsTo(models.customer_address, {
      foreignKey: "address_id",
    }),
      order_detail.belongsTo(models.customer, {
        foreignKey: "customer_id",
      });
    order_detail.hasMany(models.order_item, {
      foreignKey: "order_detail_id",
    });
  };
  return order_detail;
};
