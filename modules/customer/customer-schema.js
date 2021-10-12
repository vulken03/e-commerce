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

const update_password_schema = {
  type: "object",
  properties: {
    old_password: {
      type: "string",
    },
    new_password: {
      type: "string",
    },
  },
};
module.exports = {
  loginSchema,
  signupSchema,
  profile_update_schema,
  update_password_schema,
};
