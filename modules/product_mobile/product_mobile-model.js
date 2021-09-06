const add_mobile_attributes = async (mobileAttributes) => {
  const { model_name, sku, price, storage, ram, brand_name } = mobileAttributes;
  const product_type = await _DB.product_type.findOne({
    where: {
      product_type_name: "mobile",
    },
  });

  if (product_type) {
    const add_attributes = await _DB.mobile_attributes.create({
      model_name,
      sku,
      price,
      storage,
      ram,
      brand_name,
      product_type_id: product_type.product_type_id,
    });
    if (add_attributes) {
      return true;
    } else {
      throw new Error("error while adding attributes");
    }
  } else {
    throw new Error("no product_type found");
  }
};

module.exports={
    add_mobile_attributes 
}