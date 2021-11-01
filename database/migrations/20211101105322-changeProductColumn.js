"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.changeColumn(
          "product",
          "model_id",
          {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          { transaction: t }
        ),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.changeColumn(
          "product",
          "model_name",
          {
            type: Sequelize.STRING(60),
            allowNull: false,
          },
          { transaction: t }
        ),
      ]);
    });
  },
};
