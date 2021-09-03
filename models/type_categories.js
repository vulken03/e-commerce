module.exports = (sequelize, Sequelize) => {
  const type_categories = sequelize.define("type_categories", {
    product_type_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });
  return type_categories;
};
