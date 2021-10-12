const { encryptPassword } = require("../utils/encrypt");
module.exports = (sequelize, Sequelize) => {
  const customer = sequelize.define(
    "customer",
    {
      customer_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        notNull: true,
      },
      name:{
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
      city: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      pincode: {
        type: Sequelize.INTEGER(6),
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      address: {
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
    customer.hasOne(models.verification_token, {
      foreignKey: "customer_id",
    });
  };
  return customer;
};
