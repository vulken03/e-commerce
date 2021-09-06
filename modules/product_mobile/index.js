const mobile_service = require("./product_mobile-services");
module.exports = (app) => {
  app.post("/add_mobile_attributes", mobile_service.create_attributes_mobile);
};
