const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require("../../configuration/config");
const { validatePassword } = require("../../utils/encrypt");

const create_admin = async (admin_data) => {
  const admin_creation = await _DB.admin.create({
    admin_data,
    fields: ["username", "email", "phoneno", "password"],
  });
  if (admin_creation) {
    return {
      success: true,
      data: null,
    };
  } else {
    const error_message = "error while creating admin";
    return {
      success: false,
      data: null,
      error: new Error(error_message).stack,
      message: error_message,
    };
  }
};

// outcome 1 - direct data
// outcome 2 - true/false
// outcome 3 - object with status, data, error, message
// const private_method = async () => {}

const createSessionAdmin = async (admin_id) => {
  // TODO: Try Catch is required in functions that are not public or are not kept/exported in module.exports ... follow the same at other places..
  const session = await _DB.session.create({
    user_id: admin_id,
    login_time: +moment().unix(),
    time_to_leave: +moment().add(1, "days").unix(),
    is_loggedout: 0,
    is_admin: 1,
    fields: [
      "user_id",
      "login_time",
      "time_to_leave",
      "is_loggedout",
      "is_admin",
    ],
  });
  if (session) {
    return session;
  } else {
    return false;
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
    return false;
  }
};

const admin_login = async ({ username, password }) => {
  let admin = await _DB.admin.findOne({
    where: {
      username,
    },
    attributes: ["admin_id", "username", "password"],
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
          return {
            success: true,
            data: jwt,
          };
        } else {
          const error_message = "error while generating session";
          return {
            success: false,
            data: null,
            error: new Error(error_message).stack,
            message: error_message,
          };
        }
      } else {
        const error_message = "error while session creation";
        return {
          success: false,
          data: null,
          error: new Error(error_message).stack,
          message: error_message,
        };
      }
    } else {
      const error_message = "Password is wrong";
      return {
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    }
  } else {
    const error_message = "admin not found";
    return {
      success: false,
      data: null,
      error: new Error(error_message).stack,
      message: error_message,
    };
  }
};
module.exports = {
  admin_login,
  create_admin,
};
