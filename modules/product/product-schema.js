const productSchema = {
  type: "object",
  properties: {
    product_type_name: {
      type: "string",
    },
    category_name: {
      type: "array",
      items: {
        type: "string",
      },
      minItems: 1,
    },
    brand_name: {
      type: "array",
      items: {
        type: "string",
      },
      minItems: 1,
    },
  },
};
module.exports = {
  productSchema,
};
