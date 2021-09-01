const bcrypt = require("bcrypt");
const encryptPassword = (password) => {
  const saltRound = 10;
  const salt = bcrypt.genSaltSync(saltRound);
  const hash = bcrypt.hashSync(password, salt);

  const encrypedPassword = `${salt}:${hash}`;
  return encrypedPassword;
};

const validatePassword = (password, passwordHash, salt) => {
  const hash = bcrypt.hashSync(password, salt);
  if (hash === passwordHash) {
    return true;
  } else {
    return false;
  }
};
module.exports = {
  encryptPassword,
  validatePassword,
};
