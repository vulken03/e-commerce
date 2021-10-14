const add_to_cart_schema = {
  type: "object",
  properties: {
    product_id: {
      type: "integer",
    },
    quantity: {
      type: "integer",
    },
    required: ["product_id", "quantity"],
  },
};

const manage_quantity_schema = {
  type: "object",
  properties: {
    quantity: {
      type: "integer",
    },
    required: ["quantity"],
  },
};

module.exports = {
  add_to_cart_schema,
  manage_quantity_schema,
};
