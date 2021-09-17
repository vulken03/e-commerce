const sequelize = require("sequelize");
const create_product_type = async (productData) => {
  const transaction = await _DB.sequelize.transaction();
  try {
    const { product_type_name, product_category_list, product_brand_list } =
      productData;

    const find_product_type = await _DB.product_type.findOne({
      where: {
        product_type_name,
      },
    });
    if (find_product_type) {
      throw new Error(
        "product_type is already created with this product_type_name"
      );
    }

    const create_product_type = await _DB.product_type.create(
      {
        product_type_name,
      },
      { transaction }
    );
    if (create_product_type) {
      const category = await create_category(
        create_product_type,
        product_category_list,
        {
          transaction,
        }
      );
      const brand = await create_brand(
        create_product_type,
        product_brand_list,
        {
          transaction,
        }
      );
      const [m1, m2] = await Promise.all([category, brand]);
      if (m1 && m2) {
        //console.log(typeof m1);
        await transaction.commit();
        return true;
      } else {
        throw new Error("error while creating catagery or brand");
      }
    } else {
      throw new Error("error while creating product_category");
    }
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};
const create_category = async (
  create_product_type,
  product_category_list,
  { transaction }
) => {
  let category_list = [];

  for (let i of product_category_list) {
    const check_category = await _DB.product_category.findOne({
      where: {
        category_name: i,
      },
    });
    if (check_category) {
      _DB.type_category.create(
        {
          product_type_id: create_product_type.product_type_id,
          category_id: check_category.category_id,
        },
        { transaction }
      );
    } else {
      category_list.push({
        category_name: i,
      });
    }
  }
  const create_category = await _DB.product_category.bulkCreate(category_list, {
    transaction,
  });
  let arr1 = [];
  for (let k of create_category) {
    arr1.push({
      product_type_id: create_product_type.product_type_id,
      category_id: k.category_id,
    });
  }
  await _DB.type_category.bulkCreate(arr1, { transaction });
  if (create_category) {
    return true;
  } else {
    throw new Error("error while creating product_category");
  }
};
const create_brand = async (
  create_product_type,
  product_brand_list,
  { transaction }
) => {
  let brand_list = [];
  let arr2 = [];
  for (let j of product_brand_list) {
    const check_brand = await _DB.product_brand.findOne({
      where: {
        brand_name: j,
      },
    });
    if (check_brand) {
      await _DB.type_brand.create(
        {
          product_type_id: create_product_type.product_type_id,
          brand_id: check_brand.brand_id,
        },
        { transaction }
      );
    } else {
      brand_list.push({
        brand_name: j,
      });
    }
  }
  const create_brand = await _DB.product_brand.bulkCreate(brand_list, {
    transaction,
  });
  for (let l of create_brand) {
    arr2.push({
      product_type_id: create_product_type.product_type_id,
      brand_id: l.brand_id,
    });
  }
  await _DB.type_brand.bulkCreate(arr2, { transaction });
  if (create_brand) {
    return true;
  } else {
    throw new Error("error while creating product_brand");
  }
};

const delete_product_type = async (product_type_id) => {
  const find_product_type_attribute = await _DB.product_type_attribute.findOne({
    where: {
      product_type_id,
    },
  });

  const find_product = await _DB.product.findOne({
    where: {
      product_type_id,
    },
  });
  if (!find_product_type_attribute && !find_product) {
    const product_type_deletion = await _DB.product_type.destroy({
      where: {
        product_type_id,
      },
    });
    if (product_type_deletion) {
      return true;
    } else {
      throw new Error("error while deleting...");
    }
  } else {
    throw new Error("attribute is found with this product_type");
  }
};

const product_type_listing = async () => {
  const find_product_types = await _DB.product_type.findAll({
    attributes: ["product_type_name", [
      sequelize.fn(
        "GROUP_CONCAT",
        sequelize.literal("DISTINCT `category_name`")
      ),
      "category_list",
    ], [
      sequelize.fn(
        "GROUP_CONCAT",
        sequelize.literal("DISTINCT `brand_name`")
      ),
      "brand_list",
    ]],
    include: [
      {
        model: _DB.product_category,
        attributes: [],
        through: {
          attributes: [],
        },
      },
      {
        model: _DB.product_brand,
        attributes: [
        ],
        through: {
          attributes: [],
        },
      },
    ],
    group: "product_type.product_type_id",
    raw: true,
  });
  if (find_product_types.length >= 0) {
    return find_product_types;
  } else {
    throw new Error("error while product type listing");
  }
};

const specific_product_type = async (product_type_id) => {
  const find_product_type = await _DB.product_type.findAll({
    where: {
      product_type_id,
    },
    attributes: ["product_type_name"],
    include: [
      {
        model: _DB.product_category,
        attributes: [
          [
            sequelize.fn(
              "GROUP_CONCAT",
              sequelize.literal("DISTINCT `category_name`")
            ),
            "category_list",
          ],
        ],
        through: {
          attributes: [],
        },
      },
      {
        model: _DB.product_brand,
        attributes: [
          [
            sequelize.fn(
              "GROUP_CONCAT",
              sequelize.literal("DISTINCT `brand_name`")
            ),
            "brand_list",
          ],
        ],
        through: {
          attributes: [],
        },
      },
    ],
    group: "product_type.product_type_id",
    raw: true,
  });
  if (find_product_type.length>=0) {
    return find_product_type;
  } else {
    throw new Error("product type is not found with this product_type_id");
  }
};

const update_product_type = async (product_type_id, product_type_data) => {
  const transaction = await _DB.sequelize.transaction();
  try {
    const { product_type_name, product_category_list, product_brand_list } =
      product_type_data;
    const find_product_type = await _DB.product_type.findOne({
      where: {
        product_type_id,
      },
    });
    if (find_product_type) {
      const product_type_update = await find_product_type.update(
        { product_type_name },
        transaction
      );
      if (product_type_update) {
        const category = await update_category(
          find_product_type,
          product_category_list,
          { transaction }
        );
        const brand = await update_brand(
          find_product_type,
          product_brand_list,
          { transaction }
        );
        const [m1, m2] = await Promise.all([category, brand]);
        if (m1 && m2) {
          await transaction.commit();
          return true;
        } else {
          throw new Error("error while creating category or brand..");
        }
      } else {
        throw new Error("error while updating product_type...");
      }
    } else {
      throw new Error("product_type is not found with this product_type_id");
    }
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

const update_category = async (
  find_product_type,
  product_category_list,
  { transcation }
) => {
  const find_type_category = await _DB.type_category.findAll({
    where: {
      product_type_id: find_product_type.product_type_id,
    },
  });
  if (find_type_category) {
    await _DB.type_category.destroy({
      where: {
        product_type_id: find_product_type.product_type_id,
      },
      transcation,
    });
    //if (type_category_delete) {
    const category_list = [];
    for (let a of product_category_list) {
      const find_category = await _DB.product_category.findOne({
        where: {
          category_name: a,
        },
      });

      if (!find_category) {
        category_list.push({
          category_name: a,
        });
      } else {
        await _DB.type_category.create(
          {
            category_id: find_category.category_id,
            product_type_id: find_product_type.product_type_id,
          },
          { transcation }
        );
      }
    }
    const create_category = await _DB.product_category.bulkCreate(
      category_list,
      {
        transcation,
      }
    );
    if (create_category) {
      const type_category_list = [];
      for (let b of create_category) {
        type_category_list.push({
          product_type_id: find_product_type.product_type_id,
          category_id: b.category_id,
        });
      }
      const create_type_category = await _DB.type_category.bulkCreate(
        type_category_list,
        { transcation }
      );
      if (create_type_category) {
        return true;
      } else {
        throw new Error("error while creating type category");
      }
    } else {
      throw new Error("error while creating category..");
    }
    // } else {
    //  throw new Error("error while deletion");
    //}
  } else {
    throw new Error("error while finding with this product_type_id");
  }
};

const update_brand = async (
  find_product_type,
  product_brand_list,
  { transcation }
) => {
  const find_type_brand = await _DB.type_brand.findAll({
    where: {
      product_type_id: find_product_type.product_type_id,
    },
  });
  if (find_type_brand.length) {
    await _DB.type_brand.destroy({
      where: {
        product_type_id: find_product_type.product_type_id,
      },
      transcation,
    });
    //if (type_brand_delete) {
    const brand_list = [];
    for (let a of product_brand_list) {
      const find_brand = await _DB.product_brand.findOne({
        where: {
          brand_name: a,
        },
      });

      if (!find_brand) {
        brand_list.push({
          brand_name: a,
        });
      } else {
        await _DB.type_brand.create(
          {
            brand_id: find_brand.brand_id,
            product_type_id: find_product_type.product_type_id,
          },
          { transcation }
        );
      }
    }
    const create_brand = await _DB.product_brand.bulkCreate(brand_list, {
      transcation,
    });
    if (create_brand) {
      const type_brand_list = [];
      for (let b of create_brand) {
        type_brand_list.push({
          product_type_id: find_product_type.product_type_id,
          brand_id: b.brand_id,
        });
      }
      const create_type_brand = await _DB.type_brand.bulkCreate(
        type_brand_list,
        { transcation }
      );
      if (create_type_brand) {
        return true;
      } else {
        throw new Error("error while creating type brand");
      }
    } else {
      throw new Error("error while creating brand..");
    }
    //} else {
    //throw new Error("error while deletion");
    //}
  } else {
    throw new Error("error while finding with this product_type_id");
  }
};
// const test = async () => {
//   const results = await _DB.sequelize.query("SELECT `product_type`.`product_type_name`, GROUP_CONCAT(DISTINCT `category_name`) AS `category_list`, GROUP_CONCAT(DISTINCT `brand_name`) AS `brand_list` FROM `product_type` AS `product_type` LEFT OUTER JOIN ( `type_category` AS `product_categories->type_category` INNER JOIN `product_category` AS `product_categories` ON `product_categories`.`category_id` = `product_categories->type_category`.`category_id`) ON `product_type`.`product_type_id` = `product_categories->type_category`.`product_type_id` LEFT OUTER JOIN ( `type_brand` AS `product_brands->type_brand` INNER JOIN `product_brand` AS `product_brands` ON `product_brands`.`brand_id` = `product_brands->type_brand`.`brand_id`) ON `product_type`.`product_type_id` = `product_brands->type_brand`.`product_type_id` GROUP BY `product_type`.`product_type_id`", {
//     type: _DB.Sequelize.QueryTypes['SELECT']
//   })
//   let a = '';
//   if (a == null) {
//     console.log('aaaa')
//   }
//   console.log(results)
// }

// test()


module.exports = {
  create_product_type,
  delete_product_type,
  product_type_listing,
  specific_product_type,
  update_product_type,
};
