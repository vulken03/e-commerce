const { constants } = require("../../utils/constant");
const url = require("url");
const common = require("../../utils/common");
const customer_product_model = require("./customer_product-model");
const customer_product_schema = require("./customer_product-schema");
const { logger } = require("../../utils/logger");
const add_products_to_cart = async (req, res, next) => {
  try {
    const data = req.body;
    const customer_id = req.user.customer_id;
    const { isValid, error } = common.schemaValidator(
      data,
      customer_product_schema.add_to_cart_schema
    );
    if (!isValid) {
      return next(error);
    }
    const add_to_cart = await customer_product_model.add_products_to_cart(
      customer_id,
      data
    );

    if (add_to_cart.success === true) {
      res.status(constants.responseCodes.success).json({
        code:constants.responseCodes.success,
        success: add_to_cart.success,
        data: add_to_cart.data,
        message: add_to_cart.message,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        code:constants.responseCodes.badrequest,
        success: add_to_cart.success,
        data: add_to_cart.data,
        error: add_to_cart.error,
        message: add_to_cart.message,
      });
    }
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

const remove_products_from_cart = async (req, res, next) => {
  try {
    const customer_id = req.user.customer_id;
    const cart_id = req.params.cart_id;
    const remove_from_cart = await customer_product_model.remove_from_cart(
      customer_id,
      cart_id
    );

    if (remove_from_cart.success === true) {
      res.status(constants.responseCodes.success).json({
        code:constants.responseCodes.success,
        success: remove_from_cart.success,
        data: remove_from_cart.data,
        message: remove_from_cart.message,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        code:constants.responseCodes.badrequest,
        success: remove_from_cart.success,
        data: remove_from_cart.data,
        error: remove_from_cart.error,
        message: remove_from_cart.message,
      });
    }
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

const manage_quantity = async (req, res, next) => {
  try {
    const customer_id = req.user.customer_id;
    const cart_id = req.params.cart_id;
    const quantity_data = req.body;
    const change_quantity = await customer_product_model.manage_quantity(
      cart_id,
      customer_id,
      quantity_data
    );

    if (change_quantity.success === true) {
      res.status(constants.responseCodes.success).json({
        code:constants.responseCodes.success,
        success: change_quantity.success,
        data: change_quantity.data,
        message: change_quantity.message,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        code:constants.responseCodes.badrequest,
        success: change_quantity.success,
        data: change_quantity.data,
        error: change_quantity.error,
        message: change_quantity.message,
      });
    }
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

const list_cart = async (req, res, next) => {
  try {
    const customer_id = req.user.customer_id;
    const filters = req.body || {};
    const cart_listing = await customer_product_model.list_cart(
      customer_id,
      filters
    );

    res.status(constants.responseCodes.success).json({
      code:constants.responseCodes.success,
      success: cart_listing.success,
      data: cart_listing.data,
      message: cart_listing.message,
    });
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

const place_order = async (req, res, next) => {
  try {
    const customer_id = req.user.customer_id;
    const data = req.body;
    const { isValid, error } = common.schemaValidator(
      data,
      customer_product_schema.place_order_schema
    );
    if (!isValid) {
      return next(error);
    }
    const { address_id } = data;
    const order = await customer_product_model.place_order(
      customer_id,
      address_id
    );
    if (order.success === true) {
      res.status(constants.responseCodes.success).json({
        code:constants.responseCodes.success,
        success: order.success,
        data: order.data,
        message: order.message,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        code:constants.responseCodes.badrequest,
        success: order.success,
        data: order.data,
        error: order.error,
        message: order.message,
      });
    }
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

const order_listing = async (req, res, next) => {
  try {
    const customer_id = req.user.customer_id;
    const filters = req.body || {};
    const Currenturl = url.parse(req.url, true);
    const date = Currenturl.query;
    const isAdmin = req.isAdmin;
    const { isValid, error } = common.schemaValidator(
      date,
      customer_product_schema.order_listing_schema
    );
    if (!isValid) {
      return next(error);
    }
    const order_details = await customer_product_model.order_listing(
      customer_id,
      filters,
      date,
      isAdmin
    );
    res.status(constants.responseCodes.success).json({
      code:constants.responseCodes.success,
      success: order_details.success,
      data: order_details.data,
      message: order_details.message,
    });
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

const specific_order_listing = async (req, res, next) => {
  try {
    const customer_id = req.user.customer_id;
    const order_detail_id = req.params.order_detail_id;
    const order_details = await customer_product_model.specific_order_listing(
      customer_id,
      order_detail_id
    );
    if (order_details.success === true) {
      res.status(constants.responseCodes.success).json({
        code:constants.responseCodes.success,
        success: order_details.success,
        data: order_details.data,
        message: order_details.message,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        code:constants.responseCodes.badrequest,
        success: order_details.success,
        data: order_details.data,
        error: order_details.error,
        message: order_details.message,
      });
    }
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

const cancel_order = async (req, res, next) => {
  try {
    const order_detail_id = req.params.order_detail_id;
    const customer_id = req.user.customer_id;
    const order_cancel = await customer_product_model.cancel_order(
      order_detail_id,
      customer_id
    );
    if (order_cancel.success === true) {
      res.status(constants.responseCodes.success).json({
        code:constants.responseCodes.success,
        success: order_cancel.success,
        data: order_cancel.data,
        message: order_cancel.message,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        code:constants.responseCodes.badrequest,
        success: order_cancel.success,
        data: order_cancel.data,
        error: order_cancel.error,
        message: order_cancel.message,
      });
    }
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

const order_details = async (req, res, next) => {
  try {
    const customer_id = req.user.customer_id;
    const filterby = req.body || {};
    const isAdmin = req.isAdmin;
    const order_detail = await customer_product_model.order_details(
      customer_id,
      filterby,
      isAdmin
    );
    res.status(constants.responseCodes.success).json({
      code:constants.responseCodes.success,
      success: order_detail.success,
      data: order_detail.data,
      message: order_detail.message,
    });
  } catch (err) {
    next(err);
    logger.error(err);
  }
};

const export_data_to_csv = async (req, res, next) => {
  try {
    const customer_id = req.user.customer_id;
    const export_data = await customer_product_model.export_data_to_csv(
      customer_id
    );
    if (export_data.success === true) {
      res.status(constants.responseCodes.success).json({
        code:constants.responseCodes.success,
        success: export_data.success,
        data: export_data.data,
        message: export_data.message,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
        code:constants.responseCodes.badrequest,
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
  add_products_to_cart,
  remove_products_from_cart,
  manage_quantity,
  list_cart,
  place_order,
  order_listing,
  specific_order_listing,
  cancel_order,
  order_details,
  export_data_to_csv,
};
