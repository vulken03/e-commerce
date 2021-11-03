const admin_model = require("./admin-model");
const admin_schema = require("./admin-schema");
const common = require("../../utils/common");
const { constants } = require("../../utils/constant");
const { decryptRequestData } = require("../../utils/encrypt");
const { logger } = require("../../utils/logger");
const admin_registration = async (req, res, next) => {
  try {
    // C-TODO: Take below admin data from request body..
    const admin_data = req.body;

    const create_admin = await admin_model.create_admin(admin_data);
    if (create_admin.success === true) {
      res.status(constants.responseCodes.success).json({
        success: create_admin.success,
        data: create_admin.data,
        message: create_admin.message,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        success: create_admin.success,
        data: create_admin.data,
        error: create_admin.error,
        message: create_admin.message,
      });
    }
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

const admin_login = async (req, res, next) => {
  //console.log('admin',admin_data);

  try {
    const admin_data = decryptRequestData(req.body.data);
    const { isValid, error } = common.schemaValidator(
      admin_data,
      admin_schema.loginSchema
    );
    if (!isValid) {
      return next(error);
    }
    const login = await admin_model.admin_login(admin_data);
    if (login.success === true) {
      res.status(constants.responseCodes.success).json({
        success: login.success,
        data: login.data,
        message: login.message,
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

const admin_logout = async (req, res, next) => {
  try {
    const uuid = req.user.uuid;
    const logout = await admin_model.admin_logout(uuid);
    if (logout.success === true) {
      res.status(constants.responseCodes.success).json({
        success: logout.success,
        data: logout.data,
        message: logout.message,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        success: logout.success,
        data: logout.data,
        error: logout.error,
        message: logout.message,
      });
    }
  } catch (err) {
    next(err);
  }
};

const export_data_to_csv = async (req, res, next) => {
  try {
    const export_data = await admin_model.export_data_to_csv();
    if (export_data.success === true) {
      res.status(constants.responseCodes.success).json({
        success: export_data.success,
        data: export_data.data,
        message: export_data.message,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        success: export_data.success,
        data: export_data.data,
        error: export_data.error,
        message: export_data.message,
      });
    }
  } catch (err) {
    next(err);
    logger.error(err);
  }
};
module.exports = {
  admin_login,
  admin_registration,
  admin_logout,
  export_data_to_csv,
};
