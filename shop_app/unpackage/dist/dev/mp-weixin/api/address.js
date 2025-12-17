"use strict";
const utils_request = require("../utils/request.js");
const getAddresses = () => {
  return utils_request.request({
    url: "/address",
    method: "GET"
  });
};
const addAddress = (data) => {
  return utils_request.request({
    url: "/address",
    method: "POST",
    data
  });
};
const updateAddress = (id, data) => {
  return utils_request.request({
    url: `/address/${id}`,
    method: "PUT",
    data
  });
};
const deleteAddress = (id) => {
  return utils_request.request({
    url: `/address/${id}`,
    method: "DELETE"
  });
};
exports.addAddress = addAddress;
exports.deleteAddress = deleteAddress;
exports.getAddresses = getAddresses;
exports.updateAddress = updateAddress;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/address.js.map
