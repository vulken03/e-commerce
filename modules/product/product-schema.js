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
  required: ["product_type_name", "product_category_list", "product_brand_list"],
};

const update_product_type_schema = {
  type: "object",
  properties: {
    product_type_name: {
      type: "string",
    },
  },
  required: ["product_type_name"],
};
module.exports = {
  productSchema,
  update_product_type_schema,
};
