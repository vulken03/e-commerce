const admin = require("./admin-services");

module.exports = (app) => {
  app.post("/admin_login", admin.admin_login);
  app.post("/admin_registration", admin.admin_registration);
  app.post("/admin_logout", admin.admin_logout);
};
