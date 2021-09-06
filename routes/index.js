module.exports = (app) => {
  require("../modules/admin")(app);
  require("../modules/product")(app);
  require("../modules/product_mobile")(app);
};
