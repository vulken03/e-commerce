const express = require("express");

const { authenticateRequest } = require("./sessionMiddleware");
const { morganLogger } = require("../utils/logger");
module.exports = (app) => {
  app.use(express.json());
  app.use(authenticateRequest);
  app.use(morganLogger);
};