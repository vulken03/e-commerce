const moment = require("moment");
const jwt = require("jsonwebtoken");
const { constants } = require("../utils/constant");
//const moment=require('moment')
const config = require("../configuration/config");
const { logger } = require("../utils/logger");

let verifyJWT = async (req) => {
  let userData = null;
  if (req.url === "/resetPassword") {
    userData = await verifyPasswordResetJwt(req);
  } else {
    let token = req.headers["authorization"];

    userData = jwt.verify(token, config.get("jwt.key"), {
      algorithms: ["HS384"],
    });
    if (userData) {
      return userData;
    } else {
      const error = new Error("userData not found");
      throw error;
    }
  }
};

let isValidSession = async (uuid) => {
  let isValid = false;
  let userSession = await _DB.session.findOne({
    where: {
      uuid,
    },
  });

  if (userSession) {
    const timeToLeave = moment.unix(userSession.time_to_leave);
    const isExpired = moment().isAfter(timeToLeave);

    if (!isExpired && !userSession.is_loggedout) {
      isValid = true;
    }

    if (isExpired) {
      await _DB.session.update(
        { is_loggedout: 1 },
        {
          fields: ["is_loggedout"],
        }
      );
    }
  }

  return isValid;
};

let isValidUser = async ({ isAdmin, adminId }) => {
  let isUserValid = false;
  let fetchedUser = null;
  if (isAdmin == 1) {
    fetchedUser = await _DB.admin.findOne({
      where: {
        admin_id: adminId,
      },
      raw: true,
    });
  } 
  if (fetchedUser) {
    isUserValid = true;
  }
  return {
    isUserValid,
    user: fetchedUser,
  };
};

let authenticateRequest = async (req, res, next) => {
  if (constants.insecureRoutes.includes(req.url)) {
    return next();
  }

  try {
    if (req.headers.authorization) {
      let userData = await verifyJWT(req);

      let isSessionValid = await isValidSession(userData.uuid);
      if (!isSessionValid) {
        const error = new Error(constants.errors.isExpired);
        return next(error);
      }

      let { isUserValid, user } = await isValidUser(userData);
      if (isUserValid) {
        console.log(user);
        req.user = user;
        req.user.uuid = userData.uuid;
        req.isAdmin = userData.isAdmin;
        next();
      } else {
        next(new Error("Invalid user id"));
      }
    } else {
      next(new Error("Invalid authorization"));
    }
  } catch (error) {
    logger.error("error", error);
    next(error);
  }
};

let verifyPasswordResetJwt = async (req) => {
  const token = jwt.decode(req.headers.authorization);
  console.log(token);
  const userDetails = await _DB.user.findOne({
    where: {
      user_id: token.userId,
    },
    raw: true,
  });
  if (userDetails) {
    let userData = jwt.verify(req.headers.authorization, "onlinewebtutorkey", {
      algorithms: "HS384",
    });
    return userData;
  }
};
module.exports = {
  authenticateRequest,
};