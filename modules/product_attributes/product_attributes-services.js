const product_attributes_model = require("./product_attributes-model");
const product_attributes_schema = require("./product_attributes-schema");
const common = require("../../utils/common");
const { constants } = require("../../utils/constant");
const add_product_type_attributes = async (req, res, next) => {
  try {
    const data = req.body;
    const { isValid, error } = common.schemaValidator(
      data,
      product_attributes_schema.create_attribute_schema
    );
    if (!isValid) {
      return next(error);
    }

    const add_attributes =
      await product_attributes_model.create_product_type_attribute(data);
    res.status(constants.responseCodes.success).json({
      message: constants.responseMessage.success,
      add_attributes,
    });
  } catch (err) {
    next(err);
  }
};

const add_product_specification=async (req, res, next) => {
  try {
    const data = req.body;
    const { isValid, error } = common.schemaValidator(
      data,
      product_attributes_schema.create_specification_schema
    );
    if (!isValid) {
      return next(error);
    }

    const add_specifications =
      await product_attributes_model.create_product_data(data);
    res.status(constants.responseCodes.success).json({
      message: constants.responseMessage.success,
      add_specifications,
    });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  add_product_type_attributes,
  add_product_specification
};
