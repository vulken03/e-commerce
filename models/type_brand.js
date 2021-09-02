module.exports = (sequelize, Sequelize) => {
  const type_brand = sequelize.define("type_brand", {
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    brand_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return type_brand;
};
