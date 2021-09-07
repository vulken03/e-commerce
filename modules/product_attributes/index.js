const attribute_service = require("./product_attributes-services");
const { allowAdminOnly } = require("../../utils/common");
module.exports = (app) => {
  app.post('/add_attributes',allowAdminOnly,attribute_service.add_product_type_attributes)
};
