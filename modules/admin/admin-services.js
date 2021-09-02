const admin_model = require("./admin-model");
const admin_schema = require("./admin-schema");
const common = require("../../utils/common");
const { constants } = require("../../utils/constant");
const { decryptRequestData } = require("../../utils/encrypt");
const admin_registration = async (req, res, next) => {
  try {
    const admin_data = {
      username: "Viraj@2000",
      email: "vdparmar417@gmail.com",
      phoneno: "7228854182",
      password: "1234",
    };

    const create_admin = await admin_model.create_admin(admin_data);
    res.status(constants.responseCodes.success).json({
      message: constants.responseMessage.success,
      create_admin,
    });
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

const admin_login = async (req, res, next) => {
  const admin_data = decryptRequestData(req.body.data);
  //console.log('admin',admin_data);

  try {
    const { isValid, error } = common.schemaValidator(
      admin_data,
      admin_schema.loginSchema
    );
    if (!isValid) {
      return next(error);
    }
    const login = await admin_model.admin_login(admin_data);
    res.status(constants.responseCodes.success).json({
      message: constants.responseMessage.success,
      login,
    });
  } catch (err) {
    next(err);
    logger.error(err);
  }
};
module.exports = {
  admin_login,
  admin_registration,
};
