const { allowAdminOnly } = require("../../utils/common");
const product_service = require("./product-services");
module.exports = (app) => {
  app.post("/create_product", allowAdminOnly, product_service.create_product);
};
