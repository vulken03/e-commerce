module.exports = (sequelize, Sequelize) => {
  const type_category = sequelize.define("type_category", {
    product_type_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });
  return type_category;
};
