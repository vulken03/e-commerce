const helper = require("../../utils/helper");
const sequelize = require("sequelize");

const add_products_to_cart = async (customer_id, cart_data) => {
  const { product_id, quantity } = cart_data;
  const find_product = await _DB.product.findOne({
    where: {
      product_id,
    },
    attributes: ["product_id", "quantity", "price"],
    raw: true,
  });
  if (find_product) {
    if (find_product.quantity >= quantity) {
      if (find_product.quantity > 0) {
        const add_to_cart = await _DB.cart.create(
          {
            product_id,
            customer_id,
            quantity,
          },
          { fields: ["product_id", "customer_id", "quantity"] }
        );
        if (add_to_cart) {
          await _DB.product.decrement(
            {
              quantity: +quantity,
            },
            {
              where: {
                product_id,
              },
              fields: ["product_id", "quantity"],
            }
          );
          return {
            success: true,
            data: null,
            message: "product added to the cart...",
          };
        } else {
          const error_message = "error while adding products to cart";
          return {
            success: false,
            data: null,
            error: new Error(error_message).stack,
            message: error_message,
          };
        }
      } else {
        const error_message = "out of stock";
        return {
          success: false,
          data: null,
          error: new Error(error_message).stack,
          message: error_message,
        };
      }
    } else {
      const error_message = "product is not available with given quantity";
      return {
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    }
  } else {
    const error_message = "product is not found with given product_id";
    return {
      success: false,
      data: null,
      error: new Error(error_message).stack,
      message: error_message,
    };
  }
};

const remove_from_cart = async (customer_id, cart_id) => {
  const find_product_from_cart = await _DB.cart.findOne({
    where: {
      cart_id,
    },
    attributes: ["cart_id", "product_id", "customer_id", "quantity"],
  });
  if (find_product_from_cart) {
    if (find_product_from_cart.customer_id === customer_id) {
      await find_product_from_cart.destroy();
      await _DB.product.increment(
        {
          quantity: +find_product_from_cart.quantity,
        },
        {
          where: {
            product_id: find_product_from_cart.product_id,
          },
          fields: ["product_id", "quantity"],
        }
      );
      return {
        success: true,
        data: null,
        message: "product is removed from cart..",
      };
    } else {
      const error_message = "you can't delete product from given cart_id";
      return {
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    }
  } else {
    const error_message = "product is not found with given cart_id";
    return {
      success: false,
      data: null,
      error: new Error(error_message).stack,
      message: error_message,
    };
  }
};

const manage_quantity = async (cart_id, customer_id, quantity_data) => {
  const find_cart_data = await _DB.cart.findOne({
    where: {
      cart_id,
    },
    attributes: ["product_id", "cart_id", "quantity", "customer_id"],
  });
  if (find_cart_data) {
    const find_product_data = await _DB.product.findOne({
      where: {
        product_id: find_cart_data.product_id,
      },
      attributes: ["product_id", "quantity", "price"],
      raw: true,
    });
    if (find_product_data) {
      if (find_cart_data.customer_id === customer_id) {
        if (find_product_data.quantity >= quantity_data.quantity) {
          if (find_product_data.quantity > 0) {
            //const transaction=await _DB.sequelize.transaction()
            const new_quantity =
              find_product_data.quantity +
              find_cart_data.quantity -
              quantity_data.quantity;
            if (new_quantity >= 0) {
              const quantity_update = await find_cart_data.update(
                {
                  quantity: quantity_data.quantity,
                  price: quantity_data.quantity * find_product_data.price,
                },
                {
                  fields: ["quantity", "price"],
                }
              );
              if (quantity_update) {
                const product_quantity_update = await _DB.product.update(
                  {
                    quantity: new_quantity,
                  },
                  {
                    where: {
                      product_id: find_product_data.product_id,
                    },
                    fields: ["quantity"],
                  }
                );
                if (product_quantity_update) {
                  return {
                    success: true,
                    data: null,
                    message: "given product quantity is changed..",
                  };
                } else {
                  const error_message =
                    "error while updating quantity in product..";
                  return {
                    success: false,
                    data: null,
                    error: new Error(error_message).stack,
                    message: error_message,
                  };
                }
              } else {
                const error_message = "error while updating quantity in cart..";
                return {
                  success: false,
                  data: null,
                  error: new Error(error_message).stack,
                  message: error_message,
                };
              }
            }
          } else {
            const error_message = "out of stock";
            return {
              success: false,
              data: null,
              error: new Error(error_message).stack,
              message: error_message,
            };
          }
        } else {
          const error_message = "product is not available with given quantity";
          return {
            success: false,
            data: null,
            error: new Error(error_message).stack,
            message: error_message,
          };
        }
      } else {
        const error_message = "you can't update quantity from given cart_id";
        return {
          success: false,
          data: null,
          error: new Error(error_message).stack,
          message: error_message,
        };
      }
    } else {
      const error_message = "product is not found with given product_id";
      return {
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    }
  } else {
    const error_message = "cart is not found with given cart_id";
    return {
      success: false,
      data: null,
      error: new Error(error_message).stack,
      message: error_message,
    };
  }
};

const list_cart_details = (customer_id, { sortby = {}, pagination = {} }) => {
  let filter = {};
  filter.order = helper.getSortFilter(sortby);
  if ("page" in pagination && "limit" in pagination) {
    page = Number(pagination.page);
    filter.offset = Number((pagination.page - 1) * pagination.limit);
    filter.limit = Number(pagination.limit);
  }
  const find_data = _DB.cart.findAll({
    where: {
      customer_id,
    },
    offset: filter.offset,
    limit: filter.limit,
    order: filter.order,
    attributes: ["cart_id", "product.product_name"],
    include: {
      model: _DB.product,
      attributes: [],
    },
    raw: true,
  });
  return find_data;
};

const list_cart_items = (customer_id, { sortby = {}, pagination = {} }) => {
  let filter = {};
  filter.order = helper.getSortFilter(sortby);
  if ("page" in pagination && "limit" in pagination) {
    page = Number(pagination.page);
    filter.offset = Number((pagination.page - 1) * pagination.limit);
    filter.limit = Number(pagination.limit);
  }

  const find_cart_data = _DB.cart.findOne({
    where: {
      customer_id,
    },
    offset: filter.offset,
    limit: filter.limit,
    order: filter.order,
    attributes: [
      [sequelize.literal(`(SUM(cart.quantity))`), "total_product_count"],

      [sequelize.literal(`(SUM(product.price*cart.quantity))`), "total_price"],
    ],
    include: {
      model: _DB.product,
      attributes: [],
    },
    group: "customer_id",
    raw: true,
  });
  return find_cart_data;
};

const list_cart = async (customer_id, filters) => {
  const list_data = list_cart_details(customer_id, filters);
  const list_quantity_and_price = list_cart_items(customer_id, filters);
  const [items, price_details] = await Promise.all([
    list_data,
    list_quantity_and_price,
  ]);
  if (items.length !== 0 && price_details.length !== 0) {
    const { total_product_count, total_price } = price_details;
    return {
      success: true,
      data: {
        items,
        total_product_count,
        total_price,
      },
      message: "all cart items...",
    };
  } else {
    return {
      success: true,
      data: {},
    };
  }
};
const place_order = async (customer_id, address_id) => {
  const cart_data = find_cart_data(customer_id);
  const address_data = find_address(customer_id, address_id);
  const [cart, address] = await Promise.all([cart_data, address_data]);
  if (cart.length !== 0 && address) {
    const transaction = await _DB.sequelize.transaction();
    const add_order_details = await _DB.order_detail.create(
      {
        customer_id: address.customer_id,
        address_id: address.address_id,
        order_status: "pending",
        purchase_date: new Date(),
      },
      {
        transaction,
        fields: [
          "order_detail_id",
          "customer_id",
          "address_id",
          "order_status",
          "purchase_date",
        ],
      }
    );
    if (add_order_details) {
      const product_details = [];
      for (let i of cart) {
        product_details.push({
          quantity: i.quantity,
          price: i.price * i.quantity,
          product_id: i.product_id,
          gst: i.price * i.quantity * 0.15,
          subtotal: i.price * i.quantity * 1.15 + 50, //total_price+total_price*0.15/100=>total_price(1+0.15)
          order_detail_id: add_order_details.order_detail_id,
        });
      }

      const confirm_order = await _DB.order_item.bulkCreate(product_details, {
        fields: [
          "quantity",
          "price",
          "product_id",
          "order_detail_id",
          "gst",
          "shipping_fee",
          "subtotal",
        ],
        transaction,
      });
      if (confirm_order.length !== 0) {
        await _DB.cart.destroy({
          where: {
            customer_id,
          },
        });
        await transaction.commit();
        return {
          success: true,
          data: null,
          message: "order placed successfully..",
        };
      } else {
        await transaction.rollback();
        const error_message = "error while creating order..";
        return {
          success: false,
          data: null,
          error: new Error(error_message).stack,
          message: error_message,
        };
      }
    } else {
      await transaction.rollback();
      const error_message = "error while creating order...";
      return {
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    }
  } else {
    const error_message = "data is not found";
    return {
      success: false,
      data: null,
      error: new Error(error_message).stack,
      message: error_message,
    };
  }
};

const find_cart_data = (customer_id) => {
  const find_data = _DB.cart.findAll({
    where: {
      customer_id,
    },
    attributes: [
      "customer_id",
      "product_id",
      "quantity",
      "cart_id",
      "product.price",
    ],
    include: {
      model: _DB.product,
      attributes: [],
    },
    //group: "customer_id",
    raw: true,
  });
  return find_data;
};

const find_address = (customer_id, address_id) => {
  let address = {};
  if (address_id) {
    address = _DB.customer_address.findOne({
      where: {
        customer_id,
        address_id,
      },
      attributes: ["customer_id", "address_id"],
      raw: true,
    });
  } else {
    address = _DB.customer_address.findOne({
      where: {
        customer_id,
        is_default: 1,
      },
      attributes: ["customer_id", "address_id", "is_default"],
      raw: true,
    });
  }
  return address;
};

// const list_order_details = async (
//   customer_id,
//   { sortby = {}, pagination = {} }
// ) => {
//   let filter = {};
//   filter.order = helper.getSortFilter(sortby);
//   if ("page" in pagination && "limit" in pagination) {
//     page = Number(pagination.page);
//     filter.offset = Number((pagination.page - 1) * pagination.limit);
//     filter.limit = Number(pagination.limit);
//   }
//   const order_details = await _DB.order_detail.findAll({
//     where: {
//       customer_id,
//     },
//     offset: filter.offset,
//     limit: filter.limit,
//     order: filter.order,
//     attributes: [

//       [
//         sequelize.fn("sum", sequelize.col("order_items.quantity")),
//         "total_quantity",
//       ],
//       [sequelize.fn("sum", sequelize.col("order_items.subtotal")), "subtotal"],
//     ],
//     include: {
//       model: _DB.order_item,
//       attributes: [],
//     },

//     group: ["order_items.order_detail_id"],
//     raw: true,
//   });
//   console.log(order_details);
//   return {
//     success: true,
//     data: order_details,
//     message: "all order details...",
//   };
// };

const list_order_details = async (
  customer_id,
  { sortby = {}, pagination = {} }
) => {
  let filter = {};
  filter.order = helper.getSortFilter(sortby);
  console.log("order by", filter.order);
  if ("page" in pagination && "limit" in pagination) {
    //if(pagination&&pagination.page&&pagination.limit) {
    page = pagination.page;
    filter.offset = (pagination.page - 1) * pagination.limit;
    filter.limit = pagination.limit;
    //}
  }
  const order_details = await _DB.order_detail.findAll({
    where: {
      customer_id,
    },
    offset: filter.offset,
    limit: filter.limit,
    order: filter.order,
    attributes: [
      "order_detail_id",
      "order_items.quantity",
      "order_items.price",
      "order_items.gst",
      "order_items.subtotal",
      "order_status",
      "purchase_date",
    ],
    include: {
      model: _DB.order_item,
      attributes: [],
      include: {
        model: _DB.product,
        attributes: [sequelize.literal("product_name")],
      },
    },
    //raw: true,
  });
  console.log(order_details);
  return {
    success: true,
    data: order_details,
    message: "all order details...",
  };
};

const specific_order_details = async (customer_id, order_detail_id) => {
  const find_specific_order = await _DB.order_detail.findAll({
    where: {
      order_detail_id,
      customer_id,
    },
    attributes: [
      "order_items.order_detail_id",
      "order_items.quantity",
      "order_items.price",
      "order_items.gst",
      "order_items.subtotal",
      "order_status",
      "purchase_date",
    ],
    include: {
      model: _DB.order_item,
      attributes: [],
      include: {
        model: _DB.product,
        attributes: [sequelize.literal("product_name")],
      },
    },
    raw: true,
  });
  if (find_specific_order.length) {
    return {
      success: true,
      data: find_specific_order,
      message: "specific order details...",
    };
  } else {
    const error_message = "order_details not found";
    return {
      success: false,
      data: null,
      error: new Error(error_message).stack,
      message: error_message,
    };
  }
};

const cancel_order = async (order_detail_id, customer_id) => {
  const find_order_details = await _DB.order_detail.findOne({
    where: {
      order_detail_id,
    },
    attributes: [
      "order_detail_id",
      "order_status",
      "customer_id",
      "purchase_date",
    ],
  });
  if (find_order_details) {
    if (find_order_details.customer_id === customer_id) {
      if (find_order_details.order_status === "pending") {
        dt2 = new Date();
        dt1 = find_order_details.purchase_date;
        let diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60 * 60;
        const date = Math.abs(Math.round(diff));
        if (date <= 24) {
          const cancel_order = await find_order_details.update(
            {
              order_status: "cancelled",
            },
            { fields: ["order_status"] }
          );
          if (cancel_order) {
            return {
              success: true,
              data: null,
              message: "order cancelled..",
            };
          } else {
            const error_message = "error while cancelling order";
            return {
              success: false,
              data: null,
              error: new Error(error_message).stack,
              message: error_message,
            };
          }
        } else {
          const error_message = "you can't cancel order after 24 hours.";
          return {
            success: false,
            data: null,
            error: new Error(error_message).stack,
            message: error_message,
          };
        }
      } else {
        const error_message = "you just cancel order when it is pending.";
        return {
          success: false,
          data: null,
          error: new Error(error_message).stack,
          message: error_message,
        };
      }
    } else {
      const error_message = "you can't cancel this order..";
      return {
        success: false,
        data: null,
        error: new Error(error_message).stack,
        message: error_message,
      };
    }
  } else {
    const error_message = "order is not found with given order_detail_id";
    return {
      success: false,
      data: null,
      error: new Error(error_message).stack,
      message: error_message,
    };
  }
};

module.exports = {
  add_products_to_cart,
  remove_from_cart,
  manage_quantity,
  list_cart,
  place_order,
  list_order_details,
  specific_order_details,
  cancel_order,
};
