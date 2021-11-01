module.exports = (sequelize, Sequelize) => {
  const master_model = sequelize.define("master_model", {
    model_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      notNull: true,
    },
    model_name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  });
  master_model.associate = (models) => {
    master_model.hasMany(models.customer, {
      foreignKey: { name: "model_id", unique: "uniqueSelectedItem" },
    });
  };
  return master_model;
};
