const create_product_type_attribute = async ({
  attribute_name,
  product_type_name,
  attribute_values,
}) => {
  const find_product_type = await _DB.product_type.findOne({
    where: {
      product_type_name,
    },
  });
  if (find_product_type) {
    const create_attribute = await _DB.product_type_attribute.create({
      attribute_name,
      product_type_id: find_product_type.product_type_id,
    });
    if (create_attribute) {
      const attribute_value_list = [];
      for (let i of attribute_values) {
        attribute_value_list.push({
          attribute_value: i,
          attribute_id: create_attribute.attribute_id,
        });
      }
      const create_attribute_values = await _DB.attribute_value.bulkCreate(
        attribute_value_list
      );
      if (create_attribute_values) {
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
};

module.exports = {
  create_product_type_attribute,
};
