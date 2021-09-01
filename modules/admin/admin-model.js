const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require("../../configuration/config");
const { validatePassword } = require("../../utils/encrypt");

const createSessionAdmin = async ({ admin }) => {
  const adminId = admin.admin_id;
  const session = await _DB.session.create({
    user_id: adminId,
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

const generateJwtToken = async ({ username, admin_id }, uuid, isAdmin) => {
  const adminId = admin_id;
  const token =jwt.sign(
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

const admin_login = async (userData) => {
  let admin = await _DB.admin.findOne({
    where: {
      username: userData.username,
    },
  });

  if (admin) {
    // const isValidate = validatePassword(
    //   password,
    //   admin.password.split(":")[1],
    //   admin.password.split(":")[0]
    // );
    if (userData.password === admin.password) {
      const session = await createSessionAdmin({ admin });
      if (session) {
        const { uuid, isAdmin } = session;
        const jwt = await generateJwtToken({ admin }, uuid, isAdmin);
        if (jwt) {
          return jwt;
        } else {
          throw new Error("error while generating session");
        }
      } else {
        throw new Error("error while session creation");
      }
    } else {
      throw new Error("error while validating");
    }
  } else {
    throw new Error("admin not found");
  }
};
module.exports = {
  admin_login,
};
