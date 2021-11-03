const customer_product_service = require("./customer_product-services");
const { allowCustomerOnly } = require("../../utils/common");
module.exports = (app) => {
  app.post(
    "/add_to_cart",
    allowCustomerOnly,
    customer_product_service.add_products_to_cart
  );
  app.delete(
    "/delete_from_cart/:cart_id",
    allowCustomerOnly,
    customer_product_service.remove_products_from_cart
  );
  app.put(
    "/manage_quantity/:cart_id",
    allowCustomerOnly,
    customer_product_service.manage_quantity
  );
  app.all("/list_cart", allowCustomerOnly, customer_product_service.list_cart);
  app.post(
    "/place_order",
    allowCustomerOnly,
    customer_product_service.place_order
  );
  app.all("/order_listing", customer_product_service.order_listing);
  app.get(
    "/specific_order_listing/:order_detail_id",
    customer_product_service.specific_order_listing
  );
  app.put(
    "/cancel_order/:order_detail_id",
    customer_product_service.cancel_order
  );
  app.all("/order_details", customer_product_service.order_details);

  app.get(
    "/order_history",
    allowCustomerOnly,
    customer_product_service.export_data_to_csv
  );
};
