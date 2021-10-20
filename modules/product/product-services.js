const product_model = require("./product-model");
const { constants } = require("../../utils/constant");
const product_schema = require("./product-schema");
const common = require("../../utils/common");
const url = require("url");
const { logger } = require("../../utils/logger");
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
    if (product_creation.success === true) {
      res.status(constants.responseCodes.success).json({
        success: product_creation.success,
        data: product_creation.data,
        message: product_creation.message,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        success: product_creation.success,
        data: product_creation.data,
        error: product_creation.error,
        message: product_creation.message,
      });
    }
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

const delete_product_type = async (req, res, next) => {
  try {
    const product_type_deletion = await product_model.delete_product_type(
      req.params.product_type_id
    );
    if (product_type_deletion.success === true) {
      res.status(constants.responseCodes.success).json({
        success: product_type_deletion.success,
        data: product_type_deletion.data,
        message: product_type_deletion.message,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        success: product_type_deletion.success,
        data: product_type_deletion.data,
        error: product_type_deletion.error,
        message: product_type_deletion.message,
      });
    }
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

// const product_type_filter= async (req, res, next) => {
//   try {
//     let Currenturl = url.parse(req.url, true);
//     const data=Currenturl.query;
//     const{category_name,brand_name}=data;
//     const product_list = await product_model.product_type_filter({category_name,brand_name});
//     res.status(constants.responseCodes.success).json({
//       message: constants.responseMessage.success,
//       product_list,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

const product_type_listing = async (req, res, next) => {
  try {
    let Currenturl = url.parse(req.url, true);
    const data = Currenturl.query;
    const { category_name, brand_name } = data;
    const product_type = await product_model.product_type_listing({
      category_name,
      brand_name,
    });
    if (product_type.success === true) {
      res.status(constants.responseCodes.success).json({
        success: product_type.success,
        data: product_type.data,
        message: product_type.message,
      });
    }
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

const find_single_product_type = async (req, res, next) => {
  try {
    const product_type = await product_model.specific_product_type(
      req.params.product_type_id
    );
    if (product_type.success === true) {
      res.status(constants.responseCodes.success).json({
        success: product_type.success,
        data: product_type.data,
        message: product_type.message,
      });
    }
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

const update_product_type = async (req, res, next) => {
  try {
    const product_type_data = req.body;
    const product_type_id = req.params.product_type_id;
    const { isValid, error } = common.schemaValidator(
      product_type_data,
      product_schema.productSchema
    );
    if (!isValid) {
      return next(error);
    }
    const update = await product_model.update_product_type(
      product_type_id,
      product_type_data
    );
    if (update.success === true) {
      res.status(constants.responseCodes.success).json({
        success: update.success,
        data: update.data,
        message: update.message,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        success: update.success,
        data: update.data,
        error: update.error,
        message: update.message,
      });
    }
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

const add_product_specification = async (req, res, next) => {
  try {
    const data = req.body;
    const { isValid, error } = common.schemaValidator(
      data,
      product_schema.create_specification_schema
    );
    if (!isValid) {
      return next(error);
    }

    const add_specifications = await product_model.create_product_data(data);
    if (add_specifications.success === true) {
      res.status(constants.responseCodes.success).json({
        success: add_specifications.success,
        data: add_specifications.data,
        message: add_specifications.message,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        success: add_specifications.success,
        data: add_specifications.data,
        error: add_specifications.error,
        message: add_specifications.message,
      });
    }
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

const product_listing = async (req, res, next) => {
  try {
    let Currenturl = url.parse(req.url, true);
    const data = Currenturl.query;
    const filters = req.body || {};
    // const { isValid, error } = common.schemaValidator(
    //   data,
    //   product_attributes_schema.get_product_schema
    // );
    // if (!isValid) {
    //   return next(error);
    // }
    const all_products = await product_model.product_listing(data, filters);
    if (all_products.success === true) {
      res.status(constants.responseCodes.success).json({
        success: all_products.success,
        data: all_products.data,
        message: all_products.message,
      });
    }
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

const specific_product_listing = async (req, res, next) => {
  try {
    const specific_product = await product_model.specific_product_listing(
      req.params.product_id
    );
    if (specific_product.success === true) {
      res.status(constants.responseCodes.success).json({
        success: specific_product.success,
        data: specific_product.data,
        message: specific_product.message,
      });
    }
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

const delete_product = async (req, res, next) => {
  try {
    const product_deletion = await product_model.delete_product(
      req.params.product_id
    );
    if (product_deletion.success === true) {
      res.status(constants.responseCodes.success).json({
        success: product_deletion.success,
        data: product_deletion.data,
        message: product_deletion.message,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        success: product_deletion.success,
        data: product_deletion.data,
        error: product_deletion.error,
        message: product_deletion.message,
      });
    }
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

const update_product = async (req, res, next) => {
  try {
    const data = req.body;
    const product_id = req.params.product_id;
    const { isValid, error } = common.schemaValidator(
      data,
      product_schema.create_specification_schema
    );
    if (!isValid) {
      return next(error);
    }

    const product_updation = await product_model.update_product(
      product_id,
      data
    );
    if (product_updation.success === true) {
      res.status(constants.responseCodes.success).json({
        success: product_updation.success,
        data: product_updation.data,
        message: product_updation.message,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        success: product_updation.success,
        data: product_updation.data,
        error: product_updation.error,
        message: product_updation.message,
      });
    }
  } catch (err) {
    next(err);
    logger.error(err);
  }
};
module.exports = {
  create_product_type,
  delete_product_type,
  product_type_listing,
  find_single_product_type,
  update_product_type,
  add_product_specification,
  product_listing,
  specific_product_listing,
  delete_product,
  update_product,
};
