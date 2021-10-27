const { encryptPassword } = require("../utils/encrypt");
module.exports = (sequelize, Sequelize) => {
  const customer = sequelize.define(
    "customer",
    {
      customer_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING(254),
        allowNull: false,
        unique: true,
        lowercase: true,
        trim: true,
      },
      phoneno: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },

    {
      hooks: {
        beforeCreate: (customer) => {
          customer.password = encryptPassword(customer.password);
        },
        beforeUpdate: (updatedCustomer) => {
          if (updatedCustomer.password) {
            updatedCustomer.password = encryptPassword(
              updatedCustomer.password
            );
          }
        },
      },
    }
  );
  customer.associate = (models) => {
    customer.hasMany(models.verification_token, {
      foreignKey: "customer_id",
    });
    customer.hasMany(models.customer_address, {
      foreignKey: "customer_id",
    });
    customer.hasMany(models.cart, {
      foreignKey: "customer_id",
    });
    customer.hasMany(models.order_detail, {
      foreignKey: "customer_id",
    });
  };
  return customer;
};
