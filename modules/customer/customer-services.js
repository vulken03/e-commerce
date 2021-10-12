const customer_model = require("./customer-model");
const { constants } = require("../../utils/constant");
const customer_schema = require("./customer-schema");
const { decryptRequestData } = require("../../utils/encrypt");
const common = require("../../utils/common");
const { logger } = require("../../utils/logger");
const signup = async (req, res, next) => {
  try {
    const data = req.body;
    const { isValid, error } = common.schemaValidator(
      data,
      customer_schema.signupSchema
    );
    if (!isValid) {
      return next(error);
    }
    const customer_signup = await customer_model.signup(data);

    if (customer_signup.success === true) {
      res.status(constants.responseCodes.success).json({
        success: customer_signup.success,
        data: customer_signup.data,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        success: customer_signup.success,
        data: customer_signup.data,
        error: customer_signup.error,
        message: customer_signup.message,
      });
    }
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

const login = async (req, res, next) => {
  const customer_data = decryptRequestData(req.body.data);
  //console.log('admin',admin_data);

  try {
    const { isValid, error } = common.schemaValidator(
      customer_data,
      customer_schema.loginSchema
    );
    if (!isValid) {
      return next(error);
    }
    const login = await customer_model.login(customer_data);
    if (login.success === true) {
      res.status(constants.responseCodes.success).json({
        success: login.success,
        data: login.data,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        success: login.success,
        data: login.data,
        error: login.error,
        message: login.message,
      });
    }
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

const update_profile = async (req, res, next) => {
  try {
    const data = req.body;
    const customer_id = req.user.customer_id;
    const customer_params_id = req.params.customer_params_id;
    const { isValid, error } = common.schemaValidator(
      data,
      customer_schema.profile_update_schema
    );
    if (!isValid) {
      return next(error);
    }
    const update_profile_data = await customer_model.update_profile(
      data,
      customer_id,
      customer_params_id
    );

    if (update_profile_data.success === true) {
      res.status(constants.responseCodes.success).json({
        success: update_profile_data.success,
        data: update_profile_data.data,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        success: update_profile_data.success,
        data: update_profile_data.data,
        error: update_profile_data.error,
        message: update_profile_data.message,
      });
    }
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

const update_password = async (req, res, next) => {
  try {
    const data = req.body;
    const customer_id = req.user.customer_id;
    const customer_params_id = req.params.customer_params_id;
    const { isValid, error } = common.schemaValidator(
      data,
      customer_schema.update_password_schema
    );
    if (!isValid) {
      return next(error);
    }
    const update_password_data = await customer_model.update_password(
      data,
      customer_id,
      customer_params_id
    );

    if (update_password_data.success === true) {
      res.status(constants.responseCodes.success).json({
        success: update_password_data.success,
        data: update_password_data.data,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        success: update_password_data.success,
        data: update_password_data.data,
        error: update_password_data.error,
        message: update_password_data.message,
      });
    }
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

const passwordResetMail = async (req, res, next) => {
  try {
    const user = req.body;
    const resetPassword = await customer_model.sendPasswordResetMail(user);
    if (resetPassword.success === true) {
      res.status(constants.responseCodes.success).json({
        success: resetPassword.success,
        data: resetPassword.data,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        success: resetPassword.success,
        data: resetPassword.data,
        error: resetPassword.error,
        message: resetPassword.message,
      });
    }
  } catch (err) {
    next(err);
  }
};

const password_reset = async (req, res, next) => {
  try {
    const user = req.body;
    const customer_id = req.user.customer_id;
    const resetPassword = await customer_model.reset_password(
      customer_id,
      user.password
    );
    if (resetPassword.success === true) {
      res.status(constants.responseCodes.success).json({
        success: resetPassword.success,
        data: resetPassword.data,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        success: resetPassword.success,
        data: resetPassword.data,
        error: resetPassword.error,
        message: resetPassword.message,
      });
    }
  } catch (err) {
    next(err);
  }
};

const verify_email = async (req, res, next) => {
  try {
    const uuid = req.params.uuid;
    const email_verification = await customer_model.verify_email(uuid);
    if (email_verification.success === true) {
      res.status(constants.responseCodes.success).json({
        success: email_verification.success,
        data: email_verification.data,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        success: email_verification.success,
        data: email_verification.data,
        error: email_verification.error,
        message: email_verification.message,
      });
    }
  } catch (err) {
    next(err);
  }
};
module.exports = {
  signup,
  login,
  update_profile,
  update_password,
  passwordResetMail,
  password_reset,
  verify_email,
};
