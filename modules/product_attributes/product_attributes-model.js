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
    });
    if (find_product_type) {
      const create_attribute = await _DB.product_type_attribute.create(
        {
          attribute_name,
          product_type_id: find_product_type.product_type_id,
        },
        { transaction }
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
          { transaction }
        );
        if (create_attribute_values) {
          await transaction.commit();
          return true;
        } else {
          throw new Error("error while creating attribute values");
        }
      } else {
        throw new Error("error while creating attribute");
      }
    } else {
      throw new Error("product type is not found");
    }
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

const create_product_data = async (specification_data) => {
  const transaction = await _DB.sequelize.transaction();
  try {
    const {
      product_name,
      model_name,
      product_description,
      quantity,
      price,
      product_type_name,
    } = specification_data;
    const find_product_type = await _DB.product_type.findOne({
      where: {
        product_type_name,
      },
    });
    if (find_product_type) {
      const add_product_details = await _DB.product.create(
        {
          product_name,
          model_name,
          product_description,
          quantity,
          price,
          product_type_id: find_product_type.product_type_id,
        },
        { transaction }
      );
      if (add_product_details) {
        const findData = await _DB.product_type_attribute.findAll();
        console.log(findData);
        if (findData) {
          const specification_list = [];
          for (let i of findData) {
            specification_list.push({
              product_id: add_product_details.product_id,
              attribute_id: i.attribute_id,
              value: specification_data[i.attribute_name],
            });
          }
          const add_product_specification =
            await _DB.product_attribute_value.bulkCreate(specification_list, {
              transaction,
            });
          if (add_product_specification) {
            await transaction.commit();
            return true;
          } else {
            throw new Error("error while creating specifications");
          }
        } else {
          throw new Error("no data available");
        }
      } else {
        throw new Error("error while adding product details");
      }
    } else {
      throw new Error("product type is not found");
    }
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

const product_listing = async () => {
  const all_products = await _DB.product.findAll({
    include: {
      model: _DB.product_attribute_value,
      attributes: ["value"],
      include: {
        model: _DB.product_type_attribute,
        attributes: ["attribute_name"],
      },
    },

    raw: true,
  });
  if (all_products) {
    return all_products;
  } else {
    throw new Error("error while getting all products");
  }
};

const specific_product_listing = async (product_id) => {
  const specific_product = await _DB.product.findOne({
    where: {
      product_id,
    },
    include: {
      model: _DB.product_attribute_value,
      attributes: ["value"],
      include: {
        model: _DB.product_type_attribute,
        attributes: ["attribute_name"],
      },
    },
    raw: true,
  });
  if (specific_product) {
    return specific_product;
  } else {
    throw new Error(`don't find product with this product_id`);
  }
};

const delete_product = async (product_id) => {
  const find_product = await _DB.product.findOne({
    where: {
      product_id,
    },
  });
  if (find_product) {
    const product_delete = await find_product.destroy();
    if (product_delete) {
      return true;
    } else {
      throw new Error("error while deleting");
    }
  } else {
    throw new Error("product is not found whit this product_id");
  }
};
module.exports = {
  create_product_type_attribute,
  create_product_data,
  product_listing,
  specific_product_listing,
  delete_product,
};
