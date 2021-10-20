const customer_service = require("./customer-services");
module.exports = (app) => {
  app.post("/customer_signup", customer_service.signup);
  app.post("/customer_login", customer_service.login);
  app.put(
    "/customer_profile_update/:customer_params_id",
    customer_service.update_profile
  );
  app.put(
    "/customer_password_update/:customer_params_id",
    customer_service.update_password
  );
  app.post("/password_reset_mail", customer_service.passwordResetMail);
  app.put("/resetpassword", customer_service.password_reset);
  app.post("/email_verify", customer_service.verify_email);
  app.post("/manage_address", customer_service.address_manage);
  app.delete("/delete_address/:address_id", customer_service.delete_address);
  app.put("/update_address/:address_id", customer_service.update_address);
  app.post("/customer_logout", customer_service.customer_logout);
};
