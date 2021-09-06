const create_product = async (productData) => {
  const { product_type_name, category_name, brand_name } = productData;
  const create_product_type = await _DB.product_type.create({
    product_type_name,
  });
  if (create_product_type) {
    const category = await create_category(create_product_type, category_name);
    const brand = await create_brand(create_product_type, brand_name);
    const [m1, m2] = await Promise.all([category, brand]);
    if (m1 && m2) {
      return true;
    } else {
      throw new Error("error while creating catagery or brand");
    }
  } else {
    throw new Error("error while creating product_category");
  }
};
const create_category = async (create_product_type, category_name) => {
  let category_list = [];

  for (let i of category_name) {
    const check_category = await _DB.product_categories.findOne({
      where: {
        category_name: i,
      },
    });
    if (check_category) {
      _DB.type_categories.create({
        product_type_id: create_product_type.product_type_id,
        category_id: check_category.category_id,
      });
    } else {
      category_list.push({
        category_name: i,
      });
    }
  }
  const create_category = await _DB.product_categories.bulkCreate(
    category_list
  );
  let arr1 = [];
  for (let k of create_category) {
    arr1.push({
      product_type_id: create_product_type.product_type_id,
      category_id: k.category_id,
    });
  }
  await _DB.type_categories.bulkCreate(arr1);
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

module.exports = {
  create_product,
};
