const attribute_service = require("./product_attributes-services");
const { allowAdminOnly } = require("../../utils/common");
module.exports = (app) => {
  app.post(
    "/add_attributes",
    allowAdminOnly,
    attribute_service.add_product_type_attributes
  );
  app.post(
    "/add_specifications",
    allowAdminOnly,
    attribute_service.add_product_specification
  );
  app.get(
    "/all_product_listing",
    allowAdminOnly,
    attribute_service.product_listing
  );

  app.get(
    "/specific_product_listing/:product_id",
    allowAdminOnly,
    attribute_service.specific_product_listing
  );

  app.delete(
    "/delete_product/:product_id",
    allowAdminOnly,
    attribute_service.delete_product
  );
};
