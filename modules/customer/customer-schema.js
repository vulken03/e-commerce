const loginSchema = {
    type: "object",
    properties: {
      username: {
        type: "string",
        maxLength: 20,
      },
      password: {
        type: "string",
      },
      required: ["username", "password"],
    },
  };
  module.exports={
      loginSchema
  }