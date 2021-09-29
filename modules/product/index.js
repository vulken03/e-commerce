const { allowAdminOnly } = require("../../utils/common");
const product_service = require("./product-services");
module.exports = (app) => {
  app.post(
    "/create_product_type",
    allowAdminOnly,
    product_service.create_product_type
  );
  app.delete(
    "/delete_product_type/:product_type_id",
    allowAdminOnly,
    product_service.delete_product_type
  );
  app.get(
    "/product_type_listing",
    allowAdminOnly,
    product_service.product_type_listing
  );

  app.get(
    "/specific_product_type/:product_type_id",
    allowAdminOnly,
    product_service.find_single_product_type
  );

  app.put(
    "/update_product_type/:product_type_id",
    allowAdminOnly,
    product_service.update_product_type
  );

  app.post(
    "/add_specifications",
    allowAdminOnly,
    product_service.add_product_specification
  );

  app.all(
    "/all_product_listing",
    allowAdminOnly,
    product_service.product_listing
  );

  app.get(
    "/specific_product_listing/:product_id",
    allowAdminOnly,
    product_service.specific_product_listing
  );

  app.delete(
    "/delete_product/:product_id",
    allowAdminOnly,
    product_service.delete_product
  );

  app.put(
    "/update_product/:product_id",
    allowAdminOnly,
    product_service.update_product
  );
};
