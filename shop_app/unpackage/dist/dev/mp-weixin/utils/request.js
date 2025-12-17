"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "http://localhost:8088/api";
const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = common_vendor.index.getStorageSync("token");
    const header = {
      "Content-Type": "application/json",
      ...options.header
    };
    if (token) {
      header["Authorization"] = `Bearer ${token}`;
    }
    common_vendor.index.request({
      url: BASE_URL + options.url,
      method: options.method || "GET",
      data: options.data || {},
      header,
      success: (res) => {
        const { code, message, data } = res.data;
        if (code >= 200 && code < 300) {
          resolve({ data, pagination: res.data.pagination || {} });
        } else {
          if (code === 401) {
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.removeStorageSync("user");
            const pages = getCurrentPages();
            const currentPage = pages[pages.length - 1];
            if (currentPage && currentPage.route !== "pages/login/login") {
              common_vendor.index.navigateTo({ url: "/pages/login/login" });
            }
          }
          common_vendor.index.showToast({
            title: message || "请求失败",
            icon: "none"
          });
          reject({ code, message, data });
        }
      },
      fail: (err) => {
        common_vendor.index.showToast({
          title: "网络请求失败",
          icon: "none"
        });
        reject(err);
      }
    });
  });
};
const filePath = "http://192.168.3.245:8088";
exports.filePath = filePath;
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
