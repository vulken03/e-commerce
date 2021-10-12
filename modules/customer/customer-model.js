//import crypto from "crypto-random-string";
//const crypto=require('crypto-random-string')
const { sendEmail } = require("../../utils/common");
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
      const transaction = await _DB.sequelize.transaction();
      const create_customer = await _DB.customer.create(userData, {
        transaction,
        fields: [
          "name",
          "username",
          "email",
          "phoneno",
          "password",
          "city",
          "pincode",
          "state",
          "country",
          "address",
        ],
      });
      if (create_customer) {
        const create_token = await _DB.verification_token.create(
          {
            customer_id: create_customer.customer_id,
          },
          { transaction, fields: ["customer_id", "token"] }
        );

        if (create_token) {
          await transaction.commit();
          await sendEmail({
            to: create_customer.email,
            subject: "account verification",
            html: `<a href="http://localhost:8085/email_verify/${create_token.token}">click here</a>`,
          });
        }
        return {
          success: true,
          data: create_customer,
        };
      } else {
        await transaction.rollback();
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

const verify_email = async (uuid) => {
  const find_token = await _DB.verification_token.findOne({
    where: {
      token: uuid,
    },
    attributes: ["token"],
    raw: true,
  });
  if (find_token) {
    await _DB.customer.update({
      is_verified: 1,
      where: {
        customer_id: find_token.customer_id,
      },
      fields: ["is_verified"],
    });
    return {
      success: true,
      data: null,
      message: "email id verified",
    };
  } else {
    const error_message = "error in token...";
    return {
      success: false,
      data: null,
      error: new Error(error_message).stack,
      message: error_message,
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

const login = async ({ email, password }) => {
  let users = await _DB.customer.findOne({
    where: {
      email,
    },
    attributes: ["username", "customer_id", "email", "password"],
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
    const error_message = new Error("user not found with this email_id");
    return {
      success: false,
      data: null,
      error: new Error(error_message).stack,
      message: error_message,
    };
  }
};

const update_profile = async (
  customer_data,
  customer_id,
  customer_params_id
) => {
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
      customer_id: customer_params_id,
    },
    attributes: ["customer_id"],
  });
  if (find_customer_data.customer_id === customer_id) {
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
    const error_message = "you can't update data with given customer_id";
    return {
      success: false,
      data: null,
      error: new Error(error_message).stack,
      message: error_message,
    };
  }
};

const update_password = async (
  password_details,
  customer_id,
  customer_params_id
) => {
  const { old_password, new_password } = password_details;
  const find_customer_data = await _DB.customer.findOne({
    where: {
      customer_id: customer_params_id,
    },
    attributes: ["customer_id", "password"],
  });

  if (find_customer_data.customer_id === customer_id) {
    const isValidate = validatePassword(
      old_password,
      find_customer_data.password.split(":")[1],
      find_customer_data.password.split(":")[0]
    );

    if (isValidate) {
      const password_update = await find_customer_data.update(
        {
          password: new_password,
        },
        { fields: ["password"] }
      );
      if (password_update) {
        return {
          success: true,
          data: null,
        };
      } else {
        const error_message = new Error("error while updating..");
        return {
          success: false,
          data: null,
          error: new Error(error_message).stack,
          message: error_message,
        };
      }
    } else {
      const error_message = new Error("your old_password is wrong");
      return {
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    }
  } else {
    const error_message = "you can't update password with given customer_id";
    return {
      success: false,
      data: null,
      error: new Error(error_message).stack,
      message: error_message,
    };
  }
};

const generatePasswordResetJwt = async (user, session) => {
  const uuid = session.uuid;
  const userId = user.customer_id;
  const email = user.email;
  const isAdmin = 0;
  const token = jwt.sign(
    {
      uuid,
      userId,
      email,
      isAdmin,
    },
    "onlinewebtutorkey",
    { expiresIn: "1h", algorithm: "HS384" }
  );
  if (token) {
    return token;
  } else {
    return false;
  }
};

const createPasswordResetSession = async (customer_id) => {
  const user_id = customer_id;
  const session = await _DB.session.create(
    {
      user_id,
      login_time: +moment().unix(),
      time_to_leave: +moment().add(1, "hours").unix(),
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
};

const sendPasswordResetMail = async (data) => {
  const User = await _DB.customer.findOne({
    where: {
      email: data.email,
    },
    attributes: ["customer_id", "username", "email"],
    raw: true,
  });
  if (User) {
    const session = await createPasswordResetSession(User.customer_id);
    if (session) {
      const token = await generatePasswordResetJwt(User, session);
      if (token) {
        await sendEmail({
          to: User.email,
          subject: "Password Reset",
          html: `<h5>Please use below token to reset your password</h5><br/><h3>${token}</h3>`,
        });
        return {
          success: true,
          data: null,
        };
      } else {
        const error_message = "error while generating token...";
        return {
          success: false,
          data: null,
          error: new Error(error_message).stack,
          message: error_message,
        };
      }
    } else {
      const error_message = "error while generating session...";
      return {
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    }
  } else {
    const error_message = "user not found with given email_id";
    return {
      success: false,
      data: null,
      error: new Error(error_message).stack,
      message: error_message,
    };
  }
};

const reset_password = async (customer_id, password) => {
  const find_user = await _DB.customer.findOne({
    where: {
      customer_id,
    },
    attributes: ["customer_id"],
  });
  if (find_user) {
    const password_reset = await find_user.update(
      {
        password,
      },
      {
        fields: ["password"],
      }
    );
    if (password_reset) {
      return {
        success: true,
        data: null,
      };
    } else {
      const error_message = "error while reset password..";
      return {
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    }
  } else {
    const error_message = "user not found with given email";
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
  verify_email,
  login,
  update_profile,
  update_password,
  sendPasswordResetMail,
  reset_password,
};
