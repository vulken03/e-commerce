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
  let my_category = [];
  let arr1 = [];
  for (let i of category_name) {
    my_category.push({
      category_name: i,
    });
  }
  const create_category = await _DB.product_categories.bulkCreate(my_category);
  for (let k of create_category) {
    arr1.push({
      product_type_id: create_product_type.product_type_id,
      category_id: k.category_id,
    });
  }
  _DB.type_categories.bulkCreate(arr1);
  if (create_category) {
    return true;
  } else {
    throw new Error("error while creating product_category");
  }
};
const create_brand = async (create_product_type, brand_name) => {
  let my_brand = [];
  let arr2 = [];
  for (let j of brand_name) {
    my_brand.push({
      brand_name: j,
    });
  }
  const create_brand = await _DB.product_brand.bulkCreate(my_brand);
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
