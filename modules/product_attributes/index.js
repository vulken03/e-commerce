const attribute_service = require("./product_attributes-services");
const { allowAdminOnly } = require("../../utils/common");
module.exports = (app) => {
  app.post(
    "/add_attributes",
    allowAdminOnly,
    attribute_service.add_product_type_attributes
  );
 
  // product/add
  // product/list
  // product/update
  // product/view
    app.put(
    "/update_product_type_attribute/:attribute_id",
    allowAdminOnly,
    attribute_service.update_product_type_attributes
  );
};
