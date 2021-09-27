const sequelize = require("sequelize");
const helper = require("../../utils/helper");
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
      brand_name,
    } = specification_data;
    const find_product_type = await _DB.product_type.findOne({
      where: {
        product_type_name,
      },
    });

    const find_product_brand = await _DB.product_brand.findOne({
      where: {
        brand_name,
      },
    });
    if (find_product_type && find_product_brand) {
      const add_product_details = await _DB.product.create(
        {
          product_name,
          model_name,
          product_description,
          quantity,
          price,
          product_type_id: find_product_type.product_type_id,
          brand_id: find_product_brand.brand_id,
        },
        { transaction }
      );
      if (add_product_details) {
        const findData = await _DB.product_type_attribute.findAll({
          where: {
            product_type_id: find_product_type.product_type_id,
          },
        });
        if (findData.length !== 0) {
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
          if (add_product_specification.length !== 0) {
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
      throw new Error(
        "product_type or product_category pr product_brand is is not found with given data"
      );
    }
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

const product_listing = async (
  { product_type_id, brand_id, low_price, high_price, product_name },
  { sortby = {}, pagination = {} }
) => {
  let filter = {
    where: {},
  };
  if (product_type_id) {
    filter.where.product_type_id = product_type_id;
  }
  if (brand_id) {
    filter.where.brand_id = brand_id;
  }

  if (product_name) {
    filter.where.product_name = product_name;
  }

  if (low_price) {
  }
  if (high_price) {
  }
  if (low_price && high_price) {
  }
  filter.attributes = [
    "product_name",
    "model_name",
    "product_description",
    "quantity",
    "price",

    [
      sequelize.literal(
        `(SELECT JSON_ARRAYAGG(JSON_OBJECT('attribute_name',
                              product_type_attribute.attribute_name,
                              'attribute_value',
                              product_attribute_value.value))
      FROM
          product_attribute_value
              LEFT JOIN
          product_type_attribute ON product_attribute_value.attribute_id = product_type_attribute.attribute_id)
      `
      ),
      "attribute_list",
    ],
  ];
  filter.order = helper.getSortFilter(sortby);

  if ("page" in pagination && "limit" in pagination) {
    page = Number(pagination.page);
    filter.offset = Number((pagination.page - 1) * pagination.limit);
    filter.limit = Number(pagination.limit);
  }

  const all_products = await _DB.product.findAll({
    where: filter.where,
    offset: filter.offset,
    limit: filter.limit,
    order: filter.order,
    attributes: filter.attributes,
    include: [
      {
        model: _DB.product_brand,
        attributes: ["brand_name"],
      },

      {
        model: _DB.product_type,
        attributes: ["product_type_name"],
        include: {
          model: _DB.product_category,
          attributes: ["category_name"],
          through: {
            attributes: [],
          },
        },
      },
    ],
  });

  if (all_products.length >= 0) {
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
  if (specific_product.length >= 0) {
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

const update_product = async (product_id, product_data) => {
  const find_product = await _DB.product.findOne({
    where: {
      product_id,
    },
  });
  if (find_product) {
    await find_product.update(product_data, {
      fields: [
        "product_name",
        "model_name",
        "product_description",
        "price",
        "quantity",
      ],
    });
    return true;
  } else {
    throw new Error("attribute is not found with this product_id");
  }
};

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
      });
    if (find_product_type_attribute) {
      const update_product_type_attribute =
        await find_product_type_attribute.update(
          {
            attribute_name,
          },
          transaction
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
          { transaction }
        );
        if (create_attribute_values) {
          await transaction.commit();
          return true;
        } else {
          throw new Error("error while creating attribute values");
        }
      } else {
        throw new Error("error while updating product_type attribute");
      }
    } else {
      throw new Error("attributes with this attribute_id is not found");
    }
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

module.exports = {
  create_product_type_attribute,
  create_product_data,
  product_listing,
  specific_product_listing,
  delete_product,
  update_product,
  update_product_type_attribute,
};
