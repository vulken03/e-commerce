const create_attribute_schema = {
  type: "object",
  properties: {
    attribute_name: {
      type: "string",
      maxLength: 20,
    },
    product_type_name: {
      type: "string",
      maxLength: 20,
    },
    attribute_values: {
      type: "array",
      items: {
        type: "string",
      },
      minItems: 1,
    },
    required: ["attribute_name", "product_type_name", "attribute_values"],
  },
};

const update_attribute_schema = {
  type: "object",
  properties: {
    attribute_name: {
      type: "string",
      maxLength: 20,
    },
    attribute_values: {
      type: "array",
      items: {
        type: "string",
      },
      minItems: 1,
    },
    required: ["attribute_name", "attribute_values"],
  },
};




module.exports = {
  create_attribute_schema,
  update_attribute_schema,
  
};
