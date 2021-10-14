const { constants } = require("../../utils/constant");
const common = require("../../utils/common");
const customer_product_model = require("./customer_product-model");
const customer_product_schema = require("./customer_product-schema");
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
        success: add_to_cart.success,
        data: add_to_cart.data,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
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
        success: remove_from_cart.success,
        data: remove_from_cart.data,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
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
        success: change_quantity.success,
        data: change_quantity.data,
      });
    } else {
      res.status(constants.responseCodes.badrequest).json({
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

const list_cart_items = async (req, res, next) => {
  try {
    const customer_id = req.user.customer_id;
    const filters = req.body || {};
    const cart_listing = await customer_product_model.list_cart_items(
      customer_id,
      filters
    );
    if (cart_listing.success === true) {
      res
        .status(constants.responseCodes.success)
        .json({ success: cart_listing.success, data: cart_listing.data });
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
  list_cart_items,
};
