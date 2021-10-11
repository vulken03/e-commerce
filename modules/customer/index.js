const customer_service = require("./customer-services");
module.exports = (app) => {
  app.post("/customer_signup", customer_service.signup);
  app.post("/customer_login", customer_service.login);
  app.put("/customer_profile_update", customer_service.update_profile);
};
