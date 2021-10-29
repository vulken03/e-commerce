const convict = require("convict");
const path = require("path");

const config = convict({
  env: {
    doc: "The application environment.",
    format: ["production", "development", "qa"],
    default: "development",
    env: "NODE_ENV",
  },
  host: {
    doc: "host name",
    format: String,
    default: "localhost",
  },
  port: {
    doc: "port number",
    format: Number,
    default: 8085,
    env: "PORT",
  },
  database: {
    name: {
      doc: "Databse name",
      format: String,
      default: "e-commerce",
    },
    username: {
      doc: "Database username",
      format: String,
      default: "root",
      env: "DB_USERNAME",
    },
    password: {
      doc: "Database password",
      format: String,
      default: "",
      env: "DB_PASSWORD",
    },
    dialect: {
      doc: "Sequelize dialect",
      format: String,
      default: "mysql",
    },
  },
  jwt: {
    key: {
      doc: "JWT key",
      format: String,
      default: "encrypt@098",
    },
    reset_password_key: {
      doc: "JWT key",
      format: String,
      default: "encrypt@200",
    },
    verification_email_key: {
      doc: "JWT key",
      format: String,
      default: "encrypt@100",
    },
  },
  logger: {
    filename: {
      doc: "Logger filename",
      format: String,
      default: "request.log",
    },
  },
  mailer: {
    //C-TODO: only read pass prop of mailer from .env file
    from: {
      doc: "From email address",
      format: String,
      default: "checkforapis@gmail.com ",
    },
    user: {
      doc: "email address",
      format: String,
      default: "checkforapis@gmail.com",
    },
    pass: {
      doc: "Email Password",
      format: String,
      default: "",
      env: "pass",
    },
  },
});

config.loadFile(path.join(__dirname, "config-" + config.get("env") + ".json"));

config.validate();

module.exports = config;