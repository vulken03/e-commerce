const customer_product_service = require("./customer_product-services");
module.exports = (app) => {
  app.post("/add_to_cart", customer_product_service.add_products_to_cart);
  app.delete(
    "/delete_from_cart/:cart_id",
    customer_product_service.remove_products_from_cart
  );
  app.put(
    "/manage_quantity/:cart_id",
    customer_product_service.manage_quantity
  );
  app.all("/list_cart", customer_product_service.list_cart);
  app.post("/place_order", customer_product_service.place_order);
  app.all("/list_order_details", customer_product_service.list_order_details);
  app.get(
    "/specific_order_details/:order_id",
    customer_product_service.specific_order_details
  );
};
