"use strict";
const utils_request = require("../utils/request.js");
const getCart = () => utils_request.request({ url: "/cart", method: "GET" });
const addToCart = (data) => utils_request.request({ url: "/cart", method: "POST", data });
const updateCartItem = (id, data) => utils_request.request({ url: `/cart/${id}`, method: "PUT", data });
const removeCartItem = (id) => utils_request.request({ url: `/cart/${id}`, method: "DELETE" });
exports.addToCart = addToCart;
exports.getCart = getCart;
exports.removeCartItem = removeCartItem;
exports.updateCartItem = updateCartItem;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/cart.js.map
