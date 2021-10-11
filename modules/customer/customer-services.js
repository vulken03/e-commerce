const customer_model = require("./customer-model");
const { constants } = require("../../utils/constant");
const customer_schema = require("./customer-schema");
const { decryptRequestData } = require("../../utils/encrypt");
const common = require("../../utils/common");
const signup = async (req, res, next) => {
  try {
    const data = req.body;
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
    const update_profile = await customer_model.update_profile(
      data,
      customer_id
    );

    if (update_profile.success === true) {
      res.status(constants.responseCodes.success).json({
        success: update_profile.success,
        data: update_profile.data,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        success: update_profile.success,
        data: update_profile.data,
        error: update_profile.error,
        message: update_profile.message,
      });
    }
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

module.exports = {
  signup,
  login,
  update_profile,
};
