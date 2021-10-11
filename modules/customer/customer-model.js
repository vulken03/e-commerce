//import crypto from "crypto-random-string";
//const crypto=require('crypto-random-string')
//const { sendEmail } = require("../../utils/common");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require("../../configuration/config");
const { validatePassword } = require("../../utils/encrypt");
const { logger } = require("../../utils/logger");
const signup = async (userData) => {
  try {
    const find_customer = await _DB.customer.findOne({
      where: {
        username: userData.username,
      },
      attributes: ["username"],
    });
    if (find_customer) {
      error_message = "customer is already created with given username";
      return {
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    } else {
      //const transaction = await _DB.sequelize.transaction();
      const create_customer = await _DB.customer.create(
        userData
        // ,{
        // transaction,
        // }
      );
      if (create_customer) {
        // const create_token = await _DB.verification_token.create(
        //   {
        //     customer_id: create_customer.customer_id,
        //     token: crypto(16),
        //   },
        //   { transaction }
        // );

        // if (create_token) {
        //   sendEmail(
        //     create_customer.email,
        //     `verification email`,
        //     create_token.token
        //   );
        // await transaction.commit();
        // }
        return {
          success: true,
          data: create_customer,
        };
      } else {
        //await transaction.rollback();
        const error_message = "error while creating customer...";
        return {
          success: false,
          data: null,
          error: new Error(error_message).stack,
          message: error_message,
        };
      }
    }
  } catch (err) {
    //await transcation.rollback();
    logger.error(err);
    return {
      success: false,
      data: null,
      error: new Error(err).stack,
      message: err,
    };
  }
};

const createSession = async ({ customer_id }) => {
  try {
    const userId = customer_id;

    const session = await _DB.session.create(
      {
        user_id: userId,
        login_time: +moment().unix(),
        time_to_leave: +moment().add(1, "days").unix(),
        is_loggedout: 0,
        is_admin: 0,
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

const login = async ({ username, password }) => {
  let users = await _DB.customer.findOne({
    where: {
      username,
    },
    attributes: ["customer_id", "username", "password"],
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
        const error_message = new Error("error while creating session");
        return {
          success: false,
          data: null,
          error: new Error(error_message).stack,
          message: error_message,
        };
      }
    } else {
      const error_message = new Error("you entered wrong password");
      return {
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    }
  } else {
    const error_message = new Error("user not found with this username");
    return {
      success: false,
      data: null,
      error: new Error(error_message).stack,
      message: error_message,
    };
  }
};

const update_profile = async (customer_data, customer_id) => {
  const {
    name,
    username,
    email,
    phoneno,
    city,
    pincode,
    state,
    country,
    address,
  } = customer_data;
  const find_customer_data = await _DB.customer.findOne({
    where: {
      customer_id,
    },
    attributes: ["customer_id"],
  });
  if (find_customer_data&&find_customer_data.customer_id === customer_id) {
    const update_profile = await find_customer_data.update(
      {
        name,
        username,
        email,
        phoneno,
        city,
        pincode,
        state,
        country,
        address,
      },
      {
        fields: [
          "name",
          "username",
          "email",
          "phoneno",
          "city",
          "pincode",
          "state",
          "country",
          "address",
        ],
      }
    );
    if (update_profile) {
      return {
        success: true,
        data: null,
      };
    } else {
      const error_message = "error while updating..";
      return {
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    }
  } else {
    const error_message = "error while finding data with given customer_id";
    return {
      success: false,
      data: null,
      error: new Error(error_message).stack,
      message: error_message,
    };
  }
};
module.exports = {
  signup,
  login,
  update_profile,
};
