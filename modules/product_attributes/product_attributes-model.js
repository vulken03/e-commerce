const { loggers } = require("winston");

const create_product_type_attribute = async ({
  attribute_name,
  product_type_name,
  attribute_values,
}) => {
  const transaction = await _DB.sequelize.transaction();
  try {
    const find_product_type = await _DB.product_type.findOne({
      where: {
        product_type_name,
      },
      attributes: ["product_type_id", "product_type_name"],
    });
    if (find_product_type) {
      const create_attribute = await _DB.product_type_attribute.create(
        {
          attribute_name,
          product_type_id: find_product_type.product_type_id,
        },
        { transaction, fields: ["product_type_id", "attribute_name"] }
      );
      if (create_attribute) {
        const attribute_value_list = [];
        for (let i of attribute_values) {
          attribute_value_list.push({
            attribute_value: i,
            attribute_id: create_attribute.attribute_id,
          });
        }
        const create_attribute_values = await _DB.attribute_value.bulkCreate(
          attribute_value_list,
          { transaction, fields: ["attribute_id", "attribute_value"] }
        );
        if (create_attribute_values.length >= 0) {
          await transaction.commit();
          return {
            success: true,
            data: create_attribute_values,
          };
        } else {
          await transaction.rollback();
          const error_message = "error while creating attribute values";
          return {
            success: false,
            data: null,
            error: new Error(error_message).stack,
            message: error_message,
          };
        }
      } else {
        await transaction.rollback();
        const error_message = "error while creating attribute";
        return {
          success: false,
          data: null,
          error: new Error(error_message).stack,
          message: error_message,
        };
      }
    } else {
      await transaction.rollback();
      const error_message = "product type is not found";
      return {
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    }
  } catch (err) {
    await transaction.rollback();
    loggers.error(err);
    return {
      success: false,
      data: null,
      error: new Error(err).stack,
      message: err,
    };
  }
};

const update_product_type_attribute = async (
  { attribute_name, attribute_values },
  attribute_id
) => {
  try {
    const transaction = await _DB.sequelize.transaction();
    const find_product_type_attribute =
      await _DB.product_type_attribute.findOne({
        where: {
          attribute_id,
        },
        attributes: ["attribute_id"],
      });
    if (find_product_type_attribute) {
      // TODO: transaction & fields prop are not kept at right place, read sequelize doc..already this was highlighted at other places, again you have made the same mistake..
      const update_product_type_attribute =
        await find_product_type_attribute.update(
          {
            attribute_name,
          },
          { transaction, fields: ["attribute_name"] }
        );
      if (update_product_type_attribute) {
        await _DB.attribute_value.destroy({
          where: {
            attribute_id,
          },
          transaction,
        });
        const attribute_values_list = [];
        for (let i of attribute_values) {
          attribute_values_list.push({
            attribute_value: i,
            attribute_id,
          });
        }
        const create_attribute_values = await _DB.attribute_value.bulkCreate(
          attribute_values_list,
          { transaction, fields: ["attribute_id", "attribute_value"] }
        );
        if (create_attribute_values.length >= 0) {
          await transaction.commit();
          return {
            success: true,
            data: null,
          };
        } else {
          await transaction.rollback();
          const error_message = "error while creating attribute values";
          return {
            success: false,
            data: null,
            error: new Error(error_message).stack,
            message: error_message,
          };
        }
      } else {
        await transaction.rollback();
        const error_message = "error while updating product_type attribute";
        return {
          success: false,
          data: null,
          error: new Error(error_message).stack,
          message: error_message,
        };
      }
    } else {
      await transaction.rollback();
      const error_message = "attributes with this attribute_id is not found";
      return {
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    }
  } catch (err) {
    await transaction.rollback();
    loggers.error(err);
    return {
      success: false,
      data: null,
      error: new Error(err).stack,
      message: err,
    };
  }
};

module.exports = {
  create_product_type_attribute,
  update_product_type_attribute,
};
