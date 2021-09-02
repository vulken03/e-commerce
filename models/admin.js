const { encryptPassword } = require("../utils/encrypt");
module.exports = (sequelize, Sequelize) => {
  const admin = sequelize.define(
    "admin",
    {
      admin_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        notNull: true,
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
    },
    {
      hooks: {
        beforeCreate: (admin) => {
          admin.password = encryptPassword(admin.password);
        },
        beforeUpdate: (updatedAdmin) => {
          if (updatedAdmin.password) {
            updatedAdmin.password = encryptPassword(updatedAdmin.password);
          }
        },
      },
    }
  );

  return admin;
};

