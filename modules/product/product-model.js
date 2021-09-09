const create_product_type = async (productData) => {
  //const transaction = _DB.sequelize.transaction();
  try {
    const { product_type_name, category_name, brand_name } = productData;

    const create_product_type = await _DB.product_type.create(
      {
        product_type_name,
      }
      //{ transaction }
    );
    if (create_product_type) {
      const category = await create_category(
        create_product_type,
        category_name
        // {
        //   transaction,
        // }
      );
      const brand = await create_brand(
        create_product_type,
        brand_name
        //   {
        //   transaction,
        // }
      );
      const [m1, m2] = await Promise.all([category, brand]);
      if (m1 && m2) {
        //await transaction.commit();
        return true;
      } else {
        throw new Error("error while creating catagery or brand");
      }
    } else {
      throw new Error("error while creating product_category");
    }
  } catch (err) {
    //await transaction.rollback();
    throw err;
  }
};
const create_category = async (create_product_type, category_name) => {
  let category_list = [];

  for (let i of category_name) {
    const check_category = await _DB.product_category.findOne({
      where: {
        category_name: i,
      },
    });
    if (check_category) {
      _DB.type_category.create({
        product_type_id: create_product_type.product_type_id,
        category_id: check_category.category_id,
      });
    } else {
      category_list.push({
        category_name: i,
      });
    }
  }
  const create_category = await _DB.product_category.bulkCreate(category_list);
  let arr1 = [];
  for (let k of create_category) {
    arr1.push({
      product_type_id: create_product_type.product_type_id,
      category_id: k.category_id,
    });
  }
  await _DB.type_category.bulkCreate(arr1);
  if (create_category) {
    return true;
  } else {
    throw new Error("error while creating product_category");
  }
};
const create_brand = async (create_product_type, brand_name) => {
  let brand_list = [];
  let arr2 = [];
  for (let j of brand_name) {
    const check_brand = await _DB.product_brand.findOne({
      where: {
        brand_name: j,
      },
    });
    if (check_brand) {
      _DB.type_brand.create({
        product_type_id: create_product_type.product_type_id,
        brand_id: check_brand.brand_id,
      });
    } else {
      brand_list.push({
        brand_name: j,
      });
    }
  }
  const create_brand = await _DB.product_brand.bulkCreate(brand_list);
  for (let l of create_brand) {
    arr2.push({
      product_type_id: create_product_type.product_type_id,
      brand_id: l.brand_id,
    });
  }
  _DB.type_brand.bulkCreate(arr2);
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
    include: [
      {
        model: _DB.product_category,
      },
      {
        model: _DB.product_brand,
      },
    ],
    raw: true,
  });
  if (find_product_types) {
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
    include: [
      {
        model: _DB.product_category,
      },
      {
        model: _DB.product_brand,
      },
    ],
    raw: true,
  });
  if (find_product_type) {
    return find_product_type;
  } else {
    throw new Error("product type is not found with this product_type_id");
  }
};
module.exports = {
  create_product_type,
  delete_product_type,
  product_type_listing,
  specific_product_type,
};
