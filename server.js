require("dotenv").config();
const express = require("express");
const middleware = require("./middleware");
const api = require("./routes");
const { errorHandler } = require("./utils/error");
const { logger } = require("./utils/logger");
const morgan = require("morgan");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
global._DB = require("./database");
global.__basedir = __dirname;
middleware(app);

api(app);

app.use(morgan("combined"));

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
