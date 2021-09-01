const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const config = require("../configuration/config");
const sequelizeTransforms = require("sequelize-transforms");
// db obj
const db = {};

// sequelize object
const sequelize = new Sequelize(
  config.get("database.name"),
  config.get("database.username"),
  config.get("database.password"),
  {
    dialect: config.get("database.dialect"),
    define: {
      timestamps: false,
      freezeTableName: true,
    },
    pool: {
      max: 5,
    },
  }
);

// checking connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to the database...");
  } catch (err) {
    console.log("Database connection failed...");
  }
})();

// models
fs.readdirSync(path.join(__dirname, "/../models")).forEach((modelFile) => {
  const model = require(path.join(__dirname, "/../models/", modelFile))(
    sequelize,
    Sequelize
  );
  db[model.getTableName()] = model;
});

// associations
for (const model in db) {
  if ("associate" in db[model]) {
    db[model].associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelizeTransforms(sequelize);

module.exports = db;
