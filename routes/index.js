module.exports = (app) => {
  require("../modules/admin")(app);
  require("../modules/product")(app);
  require("../modules/product_attributes")(app);
  require("../modules/customer")(app);
  require("../modules/customer_product")(app);
};
