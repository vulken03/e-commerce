const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require("../../configuration/config");
const { validatePassword } = require("../../utils/encrypt");

const create_admin = async (admin_data) => {
  const admin_creation = await _DB.admin.create(admin_data);
  if (admin_creation) {
    return true;
  } else {
    /* return {
      success: false,
      data: null,
      error: new Error("error while creating admin"),
      message: 'error while creating admin' // not required when success is true
    } */
    throw new Error("error while creating admin");
  }
};

// outcome 1 - direct data
// outcome 2 - true/false
// outcome 3 - object with status, data, error, message
// const private_method = async () => {}

const createSessionAdmin = async (admin_id) => {
  const session = await _DB.session.create({
    user_id: admin_id,
    login_time: +moment().unix(),
    time_to_leave: +moment().add(1, "days").unix(),
    is_loggedout: 0,
    is_admin: 1,
  });
  if (session) {
    return session;
  } else {
    throw new Error("error while creating session");
  }
};

const generateJwtToken = async (admin, uuid, isAdmin) => {
  const { username, admin_id } = admin;
  const adminId = admin_id;
  const token = jwt.sign(
    {
      uuid,
      adminId,
      username,
      isAdmin,
    },
    config.get("jwt.key"),
    {
      expiresIn: "24h",
      algorithm: "HS384",
    }
  );
  if (token) {
    return token;
  } else {
    throw new Error("error while generating token");
  }
};

const admin_login = async ({ username, password }) => {
  let admin = await _DB.admin.findOne({
    where: {
      username,
    },
    raw: true,
  });

  if (admin) {
    const isValidate = validatePassword(
      password,
      admin.password.split(":")[1],
      admin.password.split(":")[0]
    );
    if (isValidate) {
      const session = await createSessionAdmin(admin.admin_id);
      if (session) {
        const { uuid, is_admin } = session;
        const jwt = await generateJwtToken(admin, uuid, is_admin);
        if (jwt) {
          return jwt;
        } else {
          throw new Error("error while generating session");
        }
      } else {
        throw new Error("error while session creation");
      }
    } else {
      throw new Error("Password is wrong");
    }
  } else {
    throw new Error("admin not found");
  }
};
module.exports = {
  admin_login,
  create_admin,
};
