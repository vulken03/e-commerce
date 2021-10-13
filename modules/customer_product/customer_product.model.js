const add_products_to_cart = async (product_id, customer_id, cart_data) => {
  const find_product = await _DB.product.findOne({
    where: {
      product_id,
    },
    attributes: ["product_id", "quantity", "price"],
  });
  if (find_product) {
    if (
      find_product.quantiy >= cart_data.quantity &&
      find_product.quantity > 0
    ) {
      const total_price = find_product.price * cart_data.quantity;
      const add_to_cart = await _DB.cart.create(
        {
          product_id,
          customer_id,
          quantity: cart_data.quantity,
          price: total_price,
        },
        { fields: ["product_id", "customer_id", "quantity", "price"] }
      );
      if (add_to_cart) {
        await _DB.product.decrement(
          {
            quantity: +add_to_cart.quantity,
          },
          {
            where: {
              product_id,
            },
            fields: ["quantity"],
          }
        );
        return {
          success: true,
          data: null,
        };
      } else {
        const error_message = "error while adding products to cart";
        return {
          success: false,
          data: null,
          error: new Error(error_message).stack,
          message: error_message,
        };
      }
    } else {
      const error_message = "product is not available with given quantity";
      return {
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    }
  } else {
    const error_message = "product is not found with given product_id";
    return {
      success: false,
      data: null,
      error: new Error(error_message).stack,
      message: error_message,
    };
  }
};

module.exports = {
  add_products_to_cart,
};
