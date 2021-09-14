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
      "ram",
      "screen_size",
    ],
  },
};
module.exports = {
  create_attribute_schema,
  create_specification_schema,
  update_attribute_schema
};
