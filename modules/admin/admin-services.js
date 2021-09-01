const admin_model = require("./admin-model");
const admin_schema = require("./admin-schema");
const common = require("../../utils/common");
const { constants } = require("../../utils/constant");

const admin_login = async (req, res, next) => {
  const admin_data = req.body;
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
  }
};
module.exports = {
  admin_login,
};
