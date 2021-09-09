const product_model = require("./product-model");
const { constants } = require("../../utils/constant");
const product_schema = require("./product-schema");
const common = require("../../utils/common");
const create_product_type = async (req, res, next) => {
  try {
    const data = req.body;
    const { isValid, error } = common.schemaValidator(
      data,
      product_schema.productSchema
    );
    if (!isValid) {
      return next(error);
    }
    const product_creation = await product_model.create_product_type(data);
    res.status(constants.responseCodes.success).json({
      message: constants.responseMessage.success,
      product_creation,
    });
  } catch (err) {
    next(err);
  }
};

const delete_product_type = async (req, res, next) => {
  try {
    const product_type_deletion = await product_model.delete_product_type(
      req.params.product_type_id
    );
    if (product_type_deletion) {
      res.status(constants.responseCodes.success).json({
        message: constants.responseMessage.success,
        product_type_deletion,
      });
    }
  } catch (err) {
    next(err);
  }
};

const product_type_listing = async (req, res, next) => {
  try {
    const product_list = await product_model.product_type_listing();
    res.status(constants.responseCodes.success).json({
      message: constants.responseMessage.success,
      product_list,
    });
  } catch (err) {
    next(err);
  }
};

const find_single_product_type = async (req, res, next) => {
  try {
    const product_type = await product_model.specific_product_type(
      req.params.product_type_id
    );
    res.status(constants.responseCodes.success).json({
      message: constants.responseMessage.success,
      product_type,
    });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  create_product_type,
  delete_product_type,
  product_type_listing,
  find_single_product_type 
};
