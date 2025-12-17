"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/category/category.js";
  "./pages/cart/cart.js";
  "./pages/user/user.js";
  "./pages/login/login.js";
  "./pages/register/register.js";
  "./pages/product/detail.js";
  "./pages/order/list.js";
  "./pages/address/list.js";
  "./pages/address/edit.js";
}
const _sfc_main = {
  data() {
    return {
      isLogin: false
    };
  },
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:9", "App Launch");
    this.checkLoginStatus();
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:13", "App Show");
    this.checkLoginStatus();
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:17", "App Hide");
  },
  methods: {
    checkLoginStatus() {
      const token = common_vendor.index.getStorageSync("token");
      this.isLogin = !!token;
      this.updateTabBar();
    },
    updateTabBar() {
    }
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
