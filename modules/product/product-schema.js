const productSchema = {
  type: "object",
  properties: {
    product_type_name: {
      type: "string",
    },
    product_category_list: {
      type: "array",
      items: {
        type: "string",
      },
      minItems: 1,
    },
    product_brand_list: {
      type: "array",
      items: {
        type: "string",
      },
      minItems: 1,
    },
  },
  required: ["product_type_name", "product_category_list"],
};

const update_product_type_schema = {
  type: "object",
  properties: {
    product_type_name: {
      type: "string",
    },
    product_category_list: {
      type: "array",
      items: {
        type: "string",
      },
      minItems: 1,
    },
    product_brand_list: {
      type: "array",
      items: {
        type: "string",
      },
      minItems: 1,
    },
  },
  required: ["product_type_name", "product_category_list"],
};
const create_specification_schema = {
  type: "object",
  properties: {
    product_name: {
      type: "string",
      maxLength: 60,
    },
    model_name: {
      type: "string",
      maxLength: 60,
    },
    product_description: {
      type: "string",
      maxLength: 60,
    },

    quantity: {
      type: "integer",
    },

    price: {
      type: "integer",
      maximum: 100000,
      minimum: 5000,
    },
    ram: {
      type: "string",
    },
    screen_size: {
      type: "string",
    },

    required: [
      "product_name",
      "model_name",
      "product_description",
      "quantity",
      "price",
    ],
  },
};
get_product_schema = {
  type: "object",
  properties: {
    product_type_id: {
      type: "string",
    },
    brand_id: {
      type: "string",
    },
    brand_name: {
      type: "string",
    },
    required: ["product_type_id"],
  },
};

const change_order_status_schema = {
  type: "object",
  properties: {
    order_status: {
      type: "string",
    },
  },
  required: ["order_status"],
};
module.exports = {
  productSchema,
  update_product_type_schema,
  create_specification_schema,
  get_product_schema,
  change_order_status_schema,
};
