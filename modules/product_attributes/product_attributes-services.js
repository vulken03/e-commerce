const url = require("url");
const product_attributes_model = require("./product_attributes-model");
const product_attributes_schema = require("./product_attributes-schema");
const common = require("../../utils/common");
const { constants } = require("../../utils/constant");
//const { logger } = require("../../utils/logger");
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
    if (add_attributes.success === true) {
      res.status(constants.responseCodes.success).json({
        code:constants.responseCodes.success,
        success: add_attributes.success,
        data: add_attributes.data,
        message: add_attributes.message,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        code:constants.responseCodes.badrequest,
        success: add_attributes.success,
        data: add_attributes.data,
        error: add_attributes.error,
        message: add_attributes.message,
      });
    }
  } catch (err) {
    next(err);
    logger.error(err);
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
    if (update_attributes.success === true) {
      res.status(constants.responseCodes.success).json({
        code:constants.responseCodes.success,
        success: update_attributes.success,
        data: update_attributes.data,
        message: update_attributes.message,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        code:constants.responseCodes.badrequest,
        success: update_attributes.success,
        data: update_attributes.data,
        error: update_attributes.error,
        message: update_attributes.message,
      });
    }
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

const delete_product_type_attribute = async (req, res, next) => {
  try {
    const attribute_id = req.params.attribute_id;
    const delete_attribute =
      await product_attributes_model.delete_product_type_attribute(
        attribute_id
      );
    if (delete_attribute.success === true) {
      res.status(constants.responseCodes.success).json({
        code:constants.responseCodes.success,
        success: delete_attribute.success,
        data: delete_attribute.data,
        message: delete_attribute.message,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        code:constants.responseCodes.badrequest,
        success: delete_attribute.success,
        data: delete_attribute.data,
        error: delete_attribute.error,
        message: delete_attribute.message,
      });
    }
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

module.exports = {
  add_product_type_attributes,
  update_product_type_attributes,
  delete_product_type_attribute
};
