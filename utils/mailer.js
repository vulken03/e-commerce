const config = require("../configuration/config");
const mailer = require("nodemailer");

const getGmailTransport = () => {
  if (!config.get("mailer.user") || !config.get("mailer.pass")) {
    throw new Error("Please add config for mailer");
  } else {
    return mailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      tls: { rejectUnauthorized: false },
      auth: { // C-TODO: read this from convict's config variable
        user: config.get("mailer.from"),
        pass: config.get("mailer.pass"),
      },
    });
  }
};

module.exports = {
  getGmailTransport,
};
