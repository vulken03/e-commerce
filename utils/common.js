let Validator = require("jsonschema").Validator;
let v = new Validator();
const { constants } = require("./constant");
const schemaValidator = (schema, schemaStructure) => {
  let isValid = false;
  let error = null;

  const validationResult = v.validate(schema, schemaStructure);

  if (validationResult.valid) {
    isValid = true;
  } else {
    error = new Error("problem while validating data");
    throw error;
  }
  return {
    isValid,
    error,
  };
};

const allowAdminOnly = (req, res, next) => {
  if (req.isAdmin == 1) {
    next();
  } else {
    return next(new error(constants.errors.routeAccessDenied));
  }
};

module.exports = {
  schemaValidator,
  allowAdminOnly,
};
