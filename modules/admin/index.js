const admin = require("./admin-model");
const admin_middleware = require("../../utils/common");
module.exports = (app) => {
  app.post("/admin_login", admin.admin_login);
};
