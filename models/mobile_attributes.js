module.exports = (sequelize, Sequelize) => {
  const mobile_attributes = sequelize.define("mobile_attributes", {
    mobile_attribute_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      notNull: true,
    },
    model_name: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    sku: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER,
      max: 100000,
      min: 5000,
      allowNull: false,
    },
    storage: {
      type: Sequelize.ENUM,
      values: ["8GB", "16GB", "32GB", "64GB", "128GB", "256GB"],
      allowNull: false,
    },
    ram: {
      type: Sequelize.ENUM,
      values:["2GB", "3GB", "4GB", "6GB", "8GB", "12GB"],
      allowNull: false,
    },
    product_type_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    brand_name: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
  });
  mobile_attributes.associate=(models)=>{
      mobile_attributes.belongsTo(models.product_type,{
          foreignKey:"product_type_id"
      })
  }
  return mobile_attributes;
};
