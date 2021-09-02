const admin = require("./admin-services");

module.exports = (app) => {
  app.post("/admin_login", admin.admin_login);
  app.post('/create_admin',admin.admin_registration)
};
