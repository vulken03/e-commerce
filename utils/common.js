const mailer = require("./mailer");
const fs = require("fs");
const csv = require("csv");
const generate = require("csv-generate");
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
  try {
    if (req.isAdmin == 1) {
      next();
    } else {
      throw new Error("router access denied.");
    }
  } catch (err) {
    next(err);
  }
};

const allowCustomerOnly = (req, res, next) => {
  try {
    if (req.isAdmin == 0) {
      next();
    } else {
      throw new Error("invalid request..");
    }
  } catch (err) {
    next(err);
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
const generate_csv_file = (order_history) => {
  let timestamp = new Date().toISOString().replace(/[-:.]/g, "");
  let random = ("" + Math.random()).substring(2, 8);
  const random_number = timestamp + random;
  const ws = fs.createWriteStream(`./csv_files/${random_number}.xlsx`);

  return csv
    .stringify(order_history, {
      header: true,
    })
    .pipe(ws);
};
module.exports = {
  schemaValidator,
  allowAdminOnly,
  sendEmail,
  allowCustomerOnly,
  generate_csv_file,
};
