const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require("../../configuration/config");
const { validatePassword } = require("../../utils/encrypt");
const { logger } = require("../../utils/logger");

const create_admin = async (admin_data) => {
  const admin_creation = await _DB.admin.create(admin_data, {
    fields: ["username", "email", "phoneno", "password"],
  });
  if (admin_creation) {
    return {
      success: true,
      data: null,
      message: "registered successfully..",
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

const createSession = async ({ admin_id }) => {
  try {
    const userId = admin_id;

    const session = await _DB.session.create(
      {
        user_id: userId,
        login_time: +moment().unix(),
        time_to_leave: +moment().add(1, "days").unix(),
        is_loggedout: 0,
        is_admin: 1,
      },
      {
        fields: [
          "user_id",
          "login_time",
          "time_to_leave",
          "is_loggedout",
          "is_admin",
        ],
      }
    );
    if (session) {
      return session;
    } else {
      return false;
    }
  } catch (err) {
    logger.error(err);
    return false;
  }
};

const generateJwtToken = async (users, uuid, isAdmin) => {
  try {
    const { username, admin_id, customer_id } = users;
    const userId = isAdmin == 1 ? admin_id : customer_id;
    const token = jwt.sign(
      {
        uuid,
        userId,
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
  } catch (err) {
    logger.error(err);
    return false;
  }
};

const admin_login = async ({ email, password }) => {
  let users = await _DB.admin.findOne({
    where: {
      email,
    },
    attributes: ["admin_id", "email","username","password"],
    raw: true,
  });

  if (users) {
    const isValidate = validatePassword(
      password,
      users.password.split(":")[1],
      users.password.split(":")[0]
    );
    if (isValidate) {
      const session = await createSession(users);
      if (session) {
        const jwt = await generateJwtToken(
          users,
          session.uuid,
          session.is_admin
        );
        if (jwt) {
          return {
            success: true,
            data: jwt,
            message: "login successfully..",
          };
        } else {
          const error_message = "error while generating jwt";
          return {
            success: false,
            data: null,
            error: new Error(error_message).stack,
            message: error_message,
          };
        }
      } else {
        const error_message = "error while creating session";
        return {
          success: false,
          data: null,
          error: new Error(error_message).stack,
          message: error_message,
        };
      }
    } else {
      const error_message = "you entered wrong password";
      return {
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    }
  } else {
    const error_message = "user not found with this username";
    return {
      success: false,
      data: null,
      error: new Error(error_message).stack,
      message: error_message,
    };
  }
};

const admin_logout = async (uuid) => {
  const find_session = await _DB.session.findOne({
    where: {
      uuid,
    },
    attributes: ["uuid", "is_loggedout"],
  });
  if (find_session) {
    const logout = await find_session.update(
      {
        is_loggedout: 1,
      },
      {
        fields: ["is_loggedout"],
      }
    );
    if (logout) {
      return {
        success: true,
        data: null,
        message: "logout successfully..",
      };
    } else {
      return {
        message: "error while logout..",
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    }
  } else {
    return {
      message: "error while finding session...",
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
  admin_logout,
};
