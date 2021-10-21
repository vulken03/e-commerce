module.exports = (sequelize, Sequelize) => {
  const customer_address = sequelize.define("customer_address", {
    address_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      notNull: true,
    },
    customer_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    street: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    city: {
      type: Sequelize.STRING(35),
      allowNull: false,
    },
    pincode: {
      type: Sequelize.STRING(35),
      allowNull: false,
    },
    state: {
      type: Sequelize.STRING(35),
      allowNull: false,
    },
    country: {
      type: Sequelize.STRING(35),
      allowNull: false,
    },
    is_default: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
  customer_address.associate = (models) => {
    customer_address.belongsTo(models.customer, {
      foreignKey: "customer_id",
    });
    customer_address.hasMany(models.order_detail, {
      foreignKey: "address_id",
    });
  };
  return customer_address;
};
