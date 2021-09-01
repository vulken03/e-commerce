require("dotenv").config();
const express = require("express");
const api = require("./routes");
const { errorHandler } = require("./utils/error");
const middleware = require("./middleware");
const { logger } = require("./utils/logger");
const app = express();
global._DB = require("./database");
global.__basedir = __dirname;
middleware(app);

api(app);

app.use(errorHandler);

const PORT = process.env.PORT;

_DB.sequelize
  .sync({ alter: false })
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server started on port no ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("Error while syncing database...", err);
  });
