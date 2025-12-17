"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      user: null
    };
  },
  onShow() {
    this.user = common_vendor.index.getStorageSync("user");
  },
  methods: {
    goToLogin() {
      common_vendor.index.navigateTo({ url: "/pages/login/login" });
    },
    goToOrders() {
      common_vendor.index.navigateTo({ url: "/pages/order/list" });
    },
    goToAddresses() {
      common_vendor.index.navigateTo({ url: "/pages/address/list" });
    },
    logout() {
      common_vendor.index.removeStorageSync("token");
      common_vendor.index.removeStorageSync("user");
      this.user = null;
      common_vendor.index.showToast({ title: "已退出" });
      const app = getApp();
      app.checkLoginStatus();
      setTimeout(() => {
        common_vendor.index.reLaunch({ url: "/pages/index/index" });
      }, 1e3);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.user
  }, $data.user ? {
    b: $data.user.avatar_url || "/static/logo.png",
    c: common_vendor.t($data.user.nickname || $data.user.username),
    d: common_vendor.t($data.user.phone)
  } : {
    e: common_assets._imports_0,
    f: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args))
  }, {
    g: $data.user
  }, $data.user ? {
    h: common_vendor.o((...args) => $options.goToOrders && $options.goToOrders(...args))
  } : {}, {
    i: $data.user
  }, $data.user ? {
    j: common_vendor.o((...args) => $options.goToAddresses && $options.goToAddresses(...args))
  } : {}, {
    k: $data.user
  }, $data.user ? {
    l: common_vendor.o((...args) => $options.logout && $options.logout(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/user.js.map
