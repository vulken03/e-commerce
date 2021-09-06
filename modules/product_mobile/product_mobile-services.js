const mobile_model = require("./product_mobile-model");
const { constants } = require("../../utils/constant");
const create_attributes_mobile = async (req, res, next) => {
  const data = req.body;
  try {
    const add_attributes = await mobile_model.add_mobile_attributes(data);
    res.status(constants.responseCodes.success).json({
      message: constants.responseMessage.success,
      add_attributes,
    });
  } catch (err) {
    //logger.error(err);
    next(err);
  }
};
module.exports = {
  create_attributes_mobile,
};
