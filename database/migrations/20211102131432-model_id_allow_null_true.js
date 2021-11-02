"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn("product", "model_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn("product", "model_id", {
      type: Sequelize.INTEGER,
      allowNull:true,
    });
  },
};
