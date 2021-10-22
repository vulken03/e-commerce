const mailer = require("./mailer");
const config = require("../configuration/config");
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
    error = new Error(validationResult.errors);
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

const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!config.get("mailer.from")) {
      throw new Error("Empty from properti.Please config the mailer.");
    }
    const gmailMailer = mailer.getGmailTransport();
    await gmailMailer.sendMail({
      from: config.get("mailer.from"),
      to,
      subject,
      html,
    });
    return true;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  schemaValidator,
  allowAdminOnly,
  sendEmail,
};
