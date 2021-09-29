const url = require("url");
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

const update_product_type_attributes = async (req, res, next) => {
  try {
    const data = req.body;
    const attribute_id = req.params.attribute_id;
    const { isValid, error } = common.schemaValidator(
      data,
      product_attributes_schema.update_attribute_schema
    );
    if (!isValid) {
      return next(error);
    }

    const update_attributes =
      await product_attributes_model.update_product_type_attribute(
        data,
        attribute_id
      );
    res.status(constants.responseCodes.success).json({
      message: constants.responseMessage.success,
      update_attributes,
    });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  add_product_type_attributes,
  update_product_type_attributes,
};
