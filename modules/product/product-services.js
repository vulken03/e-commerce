const product_model = require("./product-model");
const { constants } = require("../../utils/constant");
const product_schema = require("./product-schema");
const common = require("../../utils/common");
const create_product = async (req, res, next) => {
  try {
    const data = req.body;
    const { isValid, error } = common.schemaValidator(
      data,
      product_schema.productSchema
    );
    if (!isValid) {
      return next(error);
    }
    const product_creation = await product_model.create_product(data);
    res.status(constants.responseCodes.success).json({
      message: constants.responseMessage.success,
      product_creation,
    });
  } catch (err) {
    next(err);
    logger.error(err);
  }
};
module.exports = {
  create_product,
};
