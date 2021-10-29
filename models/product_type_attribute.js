module.exports = (sequelize, Sequelize) => {
  const product_type_attribute = sequelize.define("product_type_attribute", {
    attribute_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      notNull: true,
    },
    attribute_name: {
      type: Sequelize.STRING(20),
      allowNull: false,
      //primaryKey:true
    },
    product_type_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },

    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: 1,
    },
  });
  product_type_attribute.associate = (models) => {
    product_type_attribute.belongsTo(models.product_type, {
      foreignKey: "product_type_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    product_type_attribute.hasMany(models.attribute_value, {
      foreignKey: "attribute_id",
    });
    product_type_attribute.hasMany(models.product_attribute_value, {
      foreignKey: "attribute_id",
    });
  };
  return product_type_attribute;
};
