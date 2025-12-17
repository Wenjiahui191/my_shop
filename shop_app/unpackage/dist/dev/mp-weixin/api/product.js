"use strict";
const utils_request = require("../utils/request.js");
const getCategories = () => utils_request.request({ url: "/products/categories", method: "GET" });
const getProducts = (params) => utils_request.request({ url: "/products", method: "GET", data: params });
const getProductById = (id) => utils_request.request({ url: `/products/${id}`, method: "GET" });
exports.getCategories = getCategories;
exports.getProductById = getProductById;
exports.getProducts = getProducts;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/product.js.map
