const sequelize = require("sequelize");
const { Op } = require("sequelize");
const helper = require("../../utils/helper");
const { decryptRequestData } = require("../../utils/encrypt");
const { logger } = require("../../utils/logger");
const create_product_type = async (productData) => {
  const transaction = await _DB.sequelize.transaction();
  try {
    const { product_type_name, product_category_list, product_brand_list } =
      productData;

    const find_product_type = await _DB.product_type.count({
      where: {
        product_type_name,
      },
    });
    if (find_product_type) {
      const error_message =
        "product_type is already created with give product_type_name";
      return {
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    }

    const create_product_type = await _DB.product_type.create(
      {
        product_type_name,
      },
      { transaction, fields: ["product_type_name"] }
    );
    console.log(create_product_type);
    if (create_product_type) {
      if (!product_brand_list) {
        const category = await create_category({
          create_product_type,
          product_category_list,
          transaction,
        });
        if (category) {
          await transaction.commit();
          return {
            success: true,
            data: create_product_type,
            message: "product_type and category created successfully...",
          };
        } else {
          await transaction.rollback();
          const error_message =
            "error while creating product_type and category";
          return {
            success: false,
            data: null,
            error: new Error(error_message).stack,
            message: error_message,
          };
        }
      } else {
        const category = await create_category({
          create_product_type,
          product_category_list,
          transaction,
        });
        const brand = await create_brand({
          create_product_type,
          product_brand_list,
          transaction,
        });
        const [m1, m2] = await Promise.all([category, brand]);
        if (m1 && m2) {
          //console.log(typeof m1);
          await transaction.commit();
          return {
            success: true,
            data: create_product_type,
            message: "product_type,category and brand created successfully...",
          };
        } else {
          await transaction.rollback();
          const error_message = "error while creating category or brand";
          return {
            success: false,
            data: null,
            error: new Error(error_message).stack,
            message: error_message,
          };
        }
      }
    } else {
      await transaction.rollback();
      const error_message = "error while creating product_type";
      return {
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    }
  } catch (err) {
    await transaction.rollback();
    logger.error(err);
    return {
      success: false,
      data: null,
      error: new Error(err).stack,
      message: err,
    };
  }
};
// C-TODO { product_type_id, product_category_list, sql_tran } - This is how you need to define the attributes/params of function. follow the same at other places..
const create_category = async ({
  create_product_type,
  product_category_list,
  transaction,
}) => {
  try {
    let category_list = [];

    for (let i of product_category_list) {
      const check_category = await _DB.product_category.findOne({
        where: {
          category_name: i,
        },
        attributes: ["category_id", "category_name"],
        raw: true,
      });
      if (check_category) {
        await _DB.type_category.create(
          {
            product_type_id: create_product_type.product_type_id,
            category_id: check_category.category_id,
            // C-TODO: this is incorrect..fields prop will be located with the transaction prop..follow the same at other places..
          },

          { transaction, fields: ["product_type_id", "category_id"] }
        );
      } else {
        category_list.push({
          category_name: i,
        });
      }
    }
    const create_category = await _DB.product_category.bulkCreate(
      category_list,
      {
        transaction,
        fields: ["category_name"],
      }
    );
    let arr1 = [];
    for (let k of create_category) {
      arr1.push({
        product_type_id: create_product_type.product_type_id,
        category_id: k.category_id,
      });
    }
    await _DB.type_category.bulkCreate(arr1, {
      transaction,
      fields: ["product_type_id", "category_id"],
    });
    if (create_category.length >= 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    logger.error(err);
    return false;
  }
};
const create_brand = async ({
  create_product_type,
  product_brand_list,
  transaction,
}) => {
  try {
    let brand_list = [];
    let arr2 = [];
    for (let j of product_brand_list) {
      const check_brand = await _DB.product_brand.findOne({
        where: {
          brand_name: j,
        },
        attributes: ["brand_id", "brand_name"],
      });
      if (check_brand) {
        await _DB.type_brand.create(
          {
            product_type_id: create_product_type.product_type_id,
            brand_id: check_brand.brand_id,
          },
          { transaction, fields: ["product_type_id", "brand_id"] }
        );
      } else {
        brand_list.push({
          brand_name: j,
        });
      }
    }
    // C-TODO: usage of sequelize's fields prop is still missing at many places..
    const create_brand = await _DB.product_brand.bulkCreate(brand_list, {
      transaction,
      fields: ["brand_name"],
    });
    for (let l of create_brand) {
      arr2.push({
        product_type_id: create_product_type.product_type_id,
        brand_id: l.brand_id,
      });
    }
    await _DB.type_brand.bulkCreate(arr2, {
      transaction,
      fields: ["product_type_id", "brand_id"],
    });
    if (create_brand.length >= 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    logger.error(err);
    return false;
  }
};
const delete_product_type = async (product_type_id) => {
  const find_product_type_attribute = await _DB.product_type_attribute.findOne({
    where: {
      product_type_id,
    },
    attributes: ["product_type_id"],
    raw: true,
  });

  const find_product = await _DB.product.findOne({
    where: {
      product_type_id,
    },
    attributes: ["product_type_id"],
    raw: true,
  });
  if (!find_product_type_attribute && !find_product) {
    const product_type_deletion = await _DB.product_type.destroy({
      where: {
        product_type_id,
      },
    });
    if (product_type_deletion) {
      return {
        success: true,
        data: null,
        message: "product_type deleted successfully...",
      };
    } else {
      const error_message = "error while deleting...";
      return {
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    }
  } else {
    const error_message = "attribute is found with given product_type";
    return {
      success: false,
      data: null,
      error: new Error(error_message).stack,
      message: error_message,
    };
  }
};

const product_type_listing = async ({ category_name, brand_name }) => {
  const filter = {};

  if (category_name && !brand_name) {
    // C-TODO: why have you kept () around js statements?? there is no need of wrapping the line with ()
    filter.attributes = ["product_type_id", "product_type_name"];
    filter.include = {
      model: _DB.product_category,
      where: {
        category_name,
      },
      attributes: [],
      through: { attributes: [] },
    };
    filter.raw = true;
  } else if (brand_name && !category_name) {
    filter.attributes = ["product_type_id", "product_type_name"];
    filter.include = {
      model: _DB.product_brand,
      where: {
        brand_name,
      },
      attributes: [],
      through: { attributes: [] },
    };
    filter.raw = true;
  } else if (category_name && brand_name) {
    filter.attributes = ["product_type_id", "product_type_name"];
    filter.include = [
      {
        model: _DB.product_category,
        where: {
          category_name,
        },
        attributes: [],
        through: { attributes: [] },
      },
      {
        model: _DB.product_brand,
        where: {
          brand_name,
        },
        attributes: [],
        through: { attributes: [] },
      },
    ];
    filter.raw = true;
  } else {
    filter.attributes = [
      "product_type_id",
      "product_type_name",
      [
        sequelize.fn(
          "GROUP_CONCAT",
          sequelize.literal("DISTINCT `category_name`")
        ),
        "category_list",
      ],
      [
        sequelize.fn(
          "GROUP_CONCAT",
          sequelize.literal("DISTINCT `brand_name`")
        ),
        "brand_list",
      ],
    ];
    filter.include = [
      {
        model: _DB.product_category,
        attributes: [],
        through: {
          attributes: [],
        },
      },
      {
        model: _DB.product_brand,
        attributes: [],
        through: {
          attributes: [],
        },
      },
    ];
    filter.raw = true;
    filter.group = "product_type.product_type_id";
  }
  const find_product_types = await _DB.product_type.findAll(filter);
  return {
    success: true,
    data: find_product_types,
    message: "all product_types",
  };
};

// const product_type_listing=async()=>{
//   const find_product_type = await _DB.product_type.findAll({
//     attributes: ["product_type_name",
//     [
//       sequelize.fn(
//         "GROUP_CONCAT",
//         sequelize.literal("DISTINCT `category_name`")
//       ),
//       "category_list",
//     ],
//     [
//       sequelize.fn(
//         "GROUP_CONCAT",
//         sequelize.literal("DISTINCT `brand_name`")
//       ),
//       "brand_list",
//     ]
//   ],
//     include: [
//       {
//         model: _DB.product_category,
//         attributes: [],
//         through: {
//           attributes: [],
//         },
//       },
//       {
//         model: _DB.product_brand,
//         attributes: [],
//         through: {
//           attributes: [],
//         },
//       },
//     ],
//     group: "product_type.product_type_id",
//     raw: true,
//   });
//   if (find_product_type.length>=0) {
//     return find_product_type;
//   } else {
//     throw new Error("product type is not found with this product_type_id");
//   }
// }

const specific_product_type = async (product_type_id) => {
  const find_product_type = await _DB.product_type.findOne({
    where: {
      product_type_id,
    },
    attributes: [
      "product_type_id",
      "product_type_name",
      [
        sequelize.fn(
          "GROUP_CONCAT",
          sequelize.literal("DISTINCT `category_name`")
        ),
        "category_list",
      ],
      [
        sequelize.fn(
          "GROUP_CONCAT",
          sequelize.literal("DISTINCT `brand_name`")
        ),
        "brand_list",
      ],

      [
        sequelize.literal(
          `(SELECT JSON_ARRAYAGG(JSON_OBJECT('attribute_name',
                              product_type_attribute.attribute_name,
                              'attribute_values',
                             attribute_value.attribute_value))
      FROM
           attribute_value
              LEFT JOIN
          product_type_attribute ON attribute_value.attribute_id = product_type_attribute.attribute_id
         )`
        ),
        "attribute_list",
      ],
    ],
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
        attributes: [],
        through: {
          attributes: [],
        },
      },
      {
        model: _DB.product_type_attribute,
        attributes: [],
      },
    ],
    group: [
      "product_type.product_type_id",
      "product_type_attributes.attribute_id",
    ],
    raw: true,
  });
  // C-TODO-don't pass success response when the given product type id does not exists
  if (find_product_type) {
    return {
      success: true,
      data: find_product_type,
      message: "specific product_type",
    };
  } else {
    const error_message = "product_type not found";
    return {
      success: false,
      data: null,
      error: new Error(error_message).stack,
      message: error_message,
    };
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
      attributes: ["product_type_id", "product_type_name"],
    });
    if (find_product_type) {
      const product_type_update = await find_product_type.update(
        { product_type_name },

        {
          fields: ["product_type_name"],
          transaction,
        }
      );
      if (product_type_update) {
        if (!product_brand_list) {
          const category = update_category({
            find_product_type,
            product_category_list,
            transaction,
          });
          if (category) {
            await transaction.commit();
            return {
              success: true,
              data: null,
              message: "product_type and product_category updated successfully",
            };
          } else {
            await transaction.rollback();
            const error_message = "error while updating product_category";
            return {
              success: false,
              data: null,
              error: new Error(error_message).stack,
              message: error_message,
            };
          }
        }
        const category = update_category({
          find_product_type,
          product_category_list,
          transaction,
        });
        const brand = update_brand({
          find_product_type,
          product_brand_list,
          transaction,
        });
        const [m1, m2] = await Promise.all([category, brand]);
        //C-TODO: read about the difference between == & === in js and make changes in below line
        if (m1.success === true && m2.success === true) {
          await transaction.commit();
          return {
            success: true,
            data: null,
            message: "product_type updated successfully...",
          };
        } else {
          await transaction.rollback();
          const error_message = "error while updating category and brand";
          return {
            success: false,
            data: null,
            error: new Error(error_message).stack,
            message: error_message,
          };
        }
      } else {
        await transaction.rollback();
        const error_message = "error while updating product_type";
        return {
          success: false,
          data: null,
          error: new Error(error_message).stack,
          message: error_message,
        };
      }
    } else {
      await transaction.rollback();
      const error_message =
        "product_type is not found with given product_type_id";
      return {
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    }
  } catch (err) {
    await transaction.rollback();
    return {
      success: false,
      data: null,
      error: new Error(err).stack,
      message: err,
    };
  }
};

const update_category = async ({
  find_product_type,
  product_category_list,
  transaction,
}) => {
  try {
    const find_type_category = await _DB.type_category.findAll({
      where: {
        product_type_id: find_product_type.product_type_id,
      },
      attributes: ["product_type_id", "category_id"],
    });
    if (find_type_category) {
      await _DB.type_category.destroy({
        where: {
          product_type_id: find_product_type.product_type_id,
        },
        transaction,
      });
      //if (type_category_delete) {
      const category_list = [];
      for (let a of product_category_list) {
        const find_category = await _DB.product_category.findOne({
          where: {
            category_name: a,
          },
          attributes: ["category_id", "category_name"],
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
            { transaction, fields: ["category_id", "product_type_id"] }
          );
        }
      }
      const create_category = await _DB.product_category.bulkCreate(
        category_list,
        {
          transaction,
          fields: ["category_name"],
        }
      );
      if (create_category.length >= 0) {
        const type_category_list = [];
        for (let b of create_category) {
          type_category_list.push({
            product_type_id: find_product_type.product_type_id,
            category_id: b.category_id,
          });
        }
        const create_type_category = await _DB.type_category.bulkCreate(
          type_category_list,
          { transaction, fields: ["product_type_id", "category_id"] }
        );
        if (create_type_category.length >= 0) {
          return {
            success: true,
            data: null,
          };
        } else {
          const error_message = "error while creating type_category";
          return {
            success: false,
            data: null,
            error: new Error(error_message).stack,
            message: error_message,
          };
        }
      } else {
        const error_message = "error while updating category";
        return {
          success: false,
          data: null,
          error: new Error(error_message).stack,
          message: error_message,
        };
      }
      // } else {
      //  throw new Error("error while deletion");
      //}
    } else {
      const error_message = "error while finding with this product_type_id";
      return {
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    }
  } catch (err) {
    logger.error(err);
    return {
      success: false,
      data: null,
      error: new Error(err).stack,
      message: err,
    };
  }
};

const update_brand = async ({
  find_product_type,
  product_brand_list,
  transaction,
}) => {
  try {
    const find_type_brand = await _DB.type_brand.findAll({
      where: {
        product_type_id: find_product_type.product_type_id,
      },
      attributes: ["product_type_id"],
    });
    // C-TODO - In case of empty type brand skip bulk destory operation
    if (find_type_brand.length) {
      await _DB.type_brand.destroy({
        where: {
          product_type_id: find_product_type.product_type_id,
        },
        transaction,
      });
    }
    const brand_list = [];
    for (let a of product_brand_list) {
      const find_brand = await _DB.product_brand.findOne({
        where: {
          brand_name: a,
        },
        attributes: ["brand_id", "brand_name"],
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
          { transaction, fields: ["brand_id", "product_type_id"] }
        );
      }
    }
    const create_brand = await _DB.product_brand.bulkCreate(brand_list, {
      transaction,
      fields: ["brand_name"],
    });
    if (create_brand.length >= 0) {
      const type_brand_list = [];
      for (let b of create_brand) {
        type_brand_list.push({
          product_type_id: find_product_type.product_type_id,
          brand_id: b.brand_id,
        });
      }
      const create_type_brand = await _DB.type_brand.bulkCreate(
        type_brand_list,
        { transaction, fields: ["product_type_id", "brand_id"] }
      );
      if (create_type_brand.length >= 0) {
        return {
          success: true,
          data: null,
        };
      } else {
        const error_message = "error while creating type_brand";
        return {
          success: false,
          data: null,
          error: new Error(error_message).stack,
          message: error_message,
        };
      }
    } else {
      const error_message = "error while updating brand";
      return {
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    }
    //} else {
    //throw new Error("error while deletion");
    //}
  } catch (err) {
    // C-TODO: update_brand is a private method that means, its not exported through module.exports or called by service method, so your return data should be similar to what you are using in try block i.e. object with status, error & message prop. and using logger, log the error.
    logger.error(err);
    return {
      success: false,
      data: null,
      error: new Error(err).stack,
      message: err,
    };
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

const product_listing = async (
  { product_type_id, brand_id, product_name, low_price, high_price },
  { sortby = {}, pagination = {}, filterby = {} }
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
    // C-TODO: make sure product name search is case insensitive and use like operator here
    filter.where.product_name = { [Op.like]: `%${product_name}%` };
  }

  if (low_price) {
    filter.where.price = { [Op.gte]: low_price };
  }
  if (high_price) {
    filter.where.price = { [Op.lte]: high_price };
  }
  if (low_price && high_price) {
    filter.where.price = { [Op.between]: [low_price, high_price] };
  }

  filter.attributes = [
    "product_id",
    "product_name",
    "product_description",
    "quantity",
    "price",
    "master_model.model_name",
    [
      sequelize.literal(
        `(SELECT JSON_ARRAYAGG(JSON_OBJECT('attribute_name',
                              product_type_attribute.attribute_name,
                              'attribute_value',
                              product_attribute_value.value))
      FROM
          product_attribute_value
              LEFT JOIN
          product_type_attribute ON product_attribute_value.attribute_id = product_type_attribute.attribute_id
          where
          product_attribute_value.product_id=product.product_id)
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
  filter.include = [
    {
      model: _DB.product_attribute_value,
      attributes: [],
      include: {
        model: _DB.product_type_attribute,
        attributes: [],
      },
    },
    {
      model: _DB.master_model,
      attributes: [],
    },
  ];

  if (Object.keys(filterby).length !== 0) {
    let S1 = "";
    for (const [key, value] of Object.entries(filterby)) {
      const va = value.map((v) => `'${v}'`);
      S1 = S1 + `(pta.attribute_name = '${key}' and pav.value IN (${va})) or`;
    }

    const result = await _DB.sequelize.query(
      `SELECT 
    p.product_name,
    p.product_id,
    (SELECT 
            JSON_ARRAYAGG(JSON_OBJECT('attribute_name',
                                product_type_attribute.attribute_name,
                                'attribute_value',
                                product_attribute_value.value))
        FROM
            product_attribute_value
                JOIN
            product_type_attribute ON product_type_attribute.attribute_id = product_attribute_value.attribute_id
              where
             product_attribute_value.product_id=p.product_id
            ) AS attribute_list
FROM
    product AS p
        JOIN
    product_attribute_value AS pav ON pav.product_id = p.product_id
        JOIN
    product_type_attribute AS pta ON pta.attribute_id = pav.attribute_id
    where (${S1.slice(0, -3)})
GROUP BY p.product_id
`,
      {
        type: _DB.Sequelize.QueryTypes["SELECT"],
      }
    );
    //if (result.length !== 0) {
    return {
      success: true,
      data: result,
      message: "all products...",
    };
    // } else {
    //   const error_message = "error while getting product data..";
    //   return {
    //     success: false,
    //     data: null,
    //     error: new Error(error_message).stack,
    //     message: error_message,
    //   };
    // }
  } else {
    const all_products = await _DB.product.findAll({
      where: filter.where,
      offset: filter.offset,
      limit: filter.limit,
      order: filter.order,
      attributes: filter.attributes,
      include: filter.include,
      group: "product.product_id",
    });
    // C-TODO: if block is not needed, if there are no records it will pass empty array [] in data..do the same at other places..
    // if (all_products.length !== 0) {
    return {
      success: true,
      data: all_products,
      message: "all products which you are filtered...",
    };
    // } else {
    //   const error_message = "error while getting product data..";
    //   return {
    //     success: false,
    //     data: null,
    //     error: new Error(error_message).stack,
    //     message: error_message,
    //   };
    // }
  }
};

const specific_product_listing = async (product_id) => {
  const specific_product = await _DB.product.findOne({
    where: {
      product_id,
    },
    attributes: [
      "product_id",
      "product_name",
      "master_model.model_name",
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
          product_type_attribute ON product_attribute_value.attribute_id = product_type_attribute.attribute_id
          where
          product_attribute_value.product_id=product.product_id)
          `
        ),
        "attribute_list",
      ],
    ],
    include: [
      {
        model: _DB.product_attribute_value,
        attributes: [],
        include: {
          model: _DB.product_type_attribute,
          attributes: [],
        },
      },
      {
        model: _DB.master_model,
        attributes: [],
      },
    ],
    raw: true,
  });
  if (specific_product) {
    return {
      success: true,
      data: specific_product,
      message: "product which is specified by you..",
    };
  } else {
    const error_message = "product not found";
    return {
      success: false,
      data: null,
      error: new Error(error_message).stack,
      message: error_message,
    };
  }
};

const delete_product = async (product_id) => {
  const find_product = await _DB.product.findOne({
    where: {
      product_id,
    },
    attributes: ["product_id"],
  });
  if (find_product) {
    const product_delete = await find_product.destroy();
    if (product_delete) {
      return {
        success: true,
        data: null,
        message: "product deleted successfully..",
      };
    } else {
      const error_message = "error while deleting";
      return {
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    }
  } else {
    const error_message = "product is not found whit this product_id";
    return {
      success: false,
      data: null,
      error: new Error(error_message).stack,
      message: error_message,
    };
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
      brand_name,
    } = specification_data;
    const [m1, m2, m3] = await Promise.all([
      _DB.product_type.findOne({
        where: {
          product_type_name,
        },
        attributes: ["product_type_id", "product_type_name"],
        raw: true,
      }),
      _DB.product_brand.findOne({
        where: {
          brand_name,
        },
        attributes: ["brand_id", "brand_name"],
        raw: true,
      }),
      _DB.master_model.findOne({
        where: {
          model_name,
        },
        attributes: ["model_id", "model_name"],
        raw: true,
      }),
    ]);
    let add_product_details = null;
    if (m1 && m2) {
      if (!m3) {
        const add_model_details = await _DB.master_model.create(
          {
            model_name,
          },
          {
            fields: ["model_id", "model_name"],
            transaction,
          }
        );
        if (add_model_details) {
          add_product_details = await _DB.product.create(
            {
              product_name,
              model_id: add_model_details.model_id,
              product_description,
              quantity,
              price,
              product_type_id: m1.product_type_id,
              brand_id: m2.brand_id,
            },
            {
              transaction,
              fields: [
                "product_name",
                "model_id",
                "product_description",
                "quantity",
                "price",
                "product_type_id",
                "brand_id",
              ],
            }
          );
        } else {
          const error_message = "error while creating model_details";
          return {
            success: false,
            data: null,
            error: new Error(error_message).stack,
            message: error_message,
          };
        }
      } else {
        add_product_details = await _DB.product.create(
          {
            product_name,
            model_id: m3.model_id,
            product_description,
            quantity,
            price,
            product_type_id: m1.product_type_id,
            brand_id: m2.brand_id,
          },
          {
            transaction,
            fields: [
              "product_name",
              "model_id",
              "product_description",
              "quantity",
              "price",
              "product_type_id",
              "brand_id",
            ],
          }
        );
      }
      if (add_product_details) {
        const findData = await _DB.product_type_attribute.findAll({
          where: {
            product_type_id: m1.product_type_id,
          },
          attributes: ["attribute_id", "attribute_name"],
          raw: true,
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
              fields: ["product_id", "attribute_id", "value"],
            });
          if (add_product_specification.length >= 0) {
            await transaction.commit();
            return {
              success: true,
              data: null,
              message: "product_created successfully...",
            };
          } else {
            await transaction.rollback();
            const error_message = "error while creating product specifications";
            return {
              success: false,
              data: null,
              error: new Error(error_message).stack,
              message: error_message,
            };
          }
        } else {
          await transaction.rollback();
          const error_message =
            "this product_type is not available in product_type schema";
          return {
            success: false,
            data: null,
            error: new Error(error_message).stack,
            message: error_message,
          };
        }
      } else {
        await transaction.rollback();
        const error_message = "error while adding product details";
        return {
          success: false,
          data: null,
          error: new Error(error_message).stack,
          message: error_message,
        };
      }
    } else {
      await transaction.rollback();
      const error_message =
        "product_type or product_category pr product_brand is is not found with given data";
      return {
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    }
  } catch (err) {
    await transaction.rollback();
    return {
      success: false,
      data: null,
      error: new Error(err).stack,
      message: err,
    };
  }
};
const update_product = async (product_id, product_data) => {
  const transaction = await _DB.sequelize.transaction();
  try {
    const find_product = await _DB.product.findOne({
      where: {
        product_id,
      },
      attributes: [
        "product_id",
        "product_name",
        "product_description",
        "price",
        "quantity",
        "product_type_id",
      ],
    });
    if (find_product) {
      const update_product = await find_product.update(product_data, {
        fields: ["product_name", "product_description", "price", "quantity"],
        transaction,
      });
      if (update_product) {
        await _DB.product_attribute_value.destroy({
          where: {
            product_id,
          },
          transaction,
        });
        const findData = await _DB.product_type_attribute.findAll({
          where: {
            product_type_id: find_product.product_type_id,
          },
          attributes: ["attribute_id", "attribute_name"],
          raw: true,
        });
        if (findData.length !== 0) {
          const specification_list = [];
          for (let i of findData) {
            specification_list.push({
              product_id: product_id,
              attribute_id: i.attribute_id,
              value: product_data[i.attribute_name],
            });
          }

          const add_product_specification =
            await _DB.product_attribute_value.bulkCreate(specification_list, {
              transaction,
              fields: ["product_id", "attribute_id", "value"],
            });
          if (add_product_specification.length !== 0) {
            await transaction.commit();
            return {
              success: true,
              data: null,
              message: "product details updated successfully..",
            };
          } else {
            const error_message = "error while creating product specifications";
            return {
              success: false,
              data: null,
              error: new Error(error_message).stack,
              message: error_message,
            };
          }
        } else {
          const error_message =
            "this product_type is not available in product_type schema";
          return {
            success: false,
            data: null,
            error: new Error(error_message).stack,
            message: error_message,
          };
        }
      } else {
        const error_message = "error while updating product_details";
        return {
          success: false,
          data: null,
          error: new Error(error_message).stack,
          message: error_message,
        };
      }
    } else {
      const error_message = "error while finding product with given product_id";
      return {
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    }
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

const manage_order_status = async (order_detail_id, order_status) => {
  const order_details = await _DB.order_detail.findOne({
    where: {
      order_detail_id,
    },
    attributes: ["order_detail_id", "order_status"],
  });
  if (order_details) {
    if (
      order_details.order_status === "pending" &&
      (order_status === "declined" || order_status === "dispatched")
    ) {
      await order_details.update(
        {
          order_status,
        },
        { fields: ["order_status"] }
      );
      return {
        success: true,
        data: null,
        message: "order status changed successfully..",
      };
    } else if (
      order_details.order_status === "dispatched" &&
      order_status === "shipped"
    ) {
      await order_details.update(
        {
          order_status,
        },
        { fields: ["order_status"] }
      );
      return {
        success: true,
        data: null,
        message: "order status changed successfully..",
      };
    } else if (
      order_details.order_status === "shipped" &&
      order_status === "delivered"
    ) {
      await order_details.update(
        {
          order_status,
        },
        { fields: ["order_status"] }
      );
      return {
        success: true,
        data: null,
        message: "order status changed successfully..",
      };
    } else if (
      order_details.order_status === "refund_pending" &&
      order_status === "refund_complete"
    ) {
      await order_details.update(
        {
          order_status,
        },
        { fields: ["order_status"] }
      );
      return {
        success: true,
        data: null,
        message: "order status changed successfully..",
      };
    } else if (
      order_details.order_status === "delivered" &&
      order_status === "refund_pending"
    ) {
      await order_details.update(
        {
          order_status,
        },
        { fields: ["order_status"] }
      );
      return {
        success: true,
        data: null,
        message: "order status changed successfully..",
      };
    } else {
      const error_message = "error while changing order status";
      return {
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    }
  } else {
    const error_message =
      "order detail is not found with given order_detail_id";
    return {
      success: false,
      data: null,
      error: new Error(error_message).stack,
      message: error_message,
    };
  }
};

module.exports = {
  create_product_type,
  delete_product_type,
  product_type_listing,
  specific_product_type,
  update_product_type,
  create_product_data,
  product_listing,
  specific_product_listing,
  delete_product,
  update_product,
  manage_order_status,
};
