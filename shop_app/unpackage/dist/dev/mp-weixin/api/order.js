"use strict";
const utils_request = require("../utils/request.js");
const createOrder = (data) => utils_request.request({ url: "/orders", method: "POST", data });
const getOrders = () => utils_request.request({ url: "/orders", method: "GET" });
exports.createOrder = createOrder;
exports.getOrders = getOrders;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/order.js.map
