const loginSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      maxLength: 254,
    },
    password: {
      type: "string",
    },
    required: ["username", "password"],
  },
};

const signupSchema = {
  type: "object",
  properties: {
    username: {
      type: "string",
      maxLength: 20,
    },
    password: {
      type: "string",
    },
    email: {
      type: "string",
      maxLength: 254,
      format: "email",
    },
    name: {
      type: "string",
      maxLength: 20,
    },
    phoneno: {
      type: "string",
      pattern: "^[0-9()-.s]+$",
    },
    city: {
      type: "string",
      maxLength: 50,
    },
    pincode: {
      type: "string",
      maxLength: 6,
    },
    state: {
      type: "string",
      maxLength: 50,
    },
    country: {
      type: "string",
      maxLength: 15,
    },
    address: {
      type: "string",
    },
    required: [
      "username",
      "password",
      "name",
      "phoneno",
      "city",
      "pincode",
      "state",
      "country",
      "address",
    ],
  },
};

const profile_update_schema = {
  type: "object",
  properties: {
    username: {
      type: "string",
      maxLength: 20,
    },
    name: {
      type: "string",
      maxLength: 20,
    },
    email: {
      type: "string",
      maxLength: 254,
    },
    phoneno: {
      type: "string",
      pattern: "^[0-9()-.s]+$",
    },
    required: ["username", "name", "phoneno", "email"],
  },
};

const update_password_schema = {
  type: "object",
  properties: {
    old_password: {
      type: "string",
    },
    new_password: {
      type: "string",
    },
    required: ["old_password", "new_password"],
  },
};

const password_reset_mail_schema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      maxLength: 254,
    },
    required: ["email"],
  },
};

const password_reset_schema = {
  type: "object",
  properties: {
    password: {
      type: "string",
    },
    required: ["password"],
  },
};

const verify_token_schema = {
  type: "object",
  properties: {
    uuid: {
      type: "string",
    },
    required: ["uuid"],
  },
};

const verify_schema = {
  type: "object",
  properties: {
    email: {
      type: "string",
    },
    required: ["email"],
  },
};

const manage_address_schema = {
  type: "object",
  properties: {
    city: {
      type: "string",
      maxLength: 50,
    },
    pincode: {
      type: "string",
      maxLength: 6,
    },
    state: {
      type: "string",
      maxLength: 50,
    },
    country: {
      type: "string",
      maxLength: 15,
    },
    street: {
      type: "string",
    },
    required: ["city", "pincode", "state", "country", "street"],
  },
};
module.exports = {
  loginSchema,
  signupSchema,
  profile_update_schema,
  update_password_schema,
  password_reset_mail_schema,
  password_reset_schema,
  verify_token_schema,
  manage_address_schema,
  verify_schema
};
