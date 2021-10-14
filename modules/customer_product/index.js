const customer_product_service = require("./customer_product-services");
module.exports = (app) => {
  app.post("/add_to_cart", customer_product_service.add_products_to_cart);
  app.delete(
    "/delete_from_cart/:cart_id",
    customer_product_service.remove_products_from_cart
  );
  app.put("/manage_quantity/:cart_id", customer_product_service.manage_quantity);
};
