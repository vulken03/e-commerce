module.exports = (app) => {
  require("../modules/admin")(app);
  require("../modules/product")(app);
  require("../modules/product_attributes")(app);
  require("../modules/customer")(app);
  require("../modules/customer_product")(app);
};
//C-TODO-If an admin user tries to access customer routes then in response message it should say "invalid request" and sane is applicable vice versa..