module.exports = (sequelize, Sequelize) => {
    const attribute_value = sequelize.define("attribute_value", {
      attribute_value_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        notNull: true,
      },
      attribute_value: {
        type: Sequelize.STRING(20),
        allowNull: false,
        //primaryKey:true
      },
      attribute_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue:1
      },
    });
    attribute_value.associate=(models)=>{
      attribute_value.belongsTo(models.product_type_attribute,{
        foreignKey:"attribute_id"
      })
    }
    return attribute_value;
  };
  