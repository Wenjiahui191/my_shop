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
      const list = [
        {
          pagePath: "pages/index/index",
          text: "首页",
          iconPath: "static/tabbar/home.png",
          selectedIconPath: "static/tabbar/home-active.png"
        },
        {
          pagePath: "pages/category/category",
          text: "分类",
          iconPath: "static/tabbar/category.png",
          selectedIconPath: "static/tabbar/category-active.png"
        }
      ];
      if (this.isLogin) {
        list.push({
          pagePath: "pages/cart/cart",
          text: "购物车",
          iconPath: "static/tabbar/cart.png",
          selectedIconPath: "static/tabbar/cart-active.png"
        });
      }
      list.push({
        pagePath: "pages/user/user",
        text: "我的",
        iconPath: "static/tabbar/user.png",
        selectedIconPath: "static/tabbar/user-active.png"
      });
      common_vendor.index.setTabBarItem({
        index: list.length - 1,
        text: "我的",
        iconPath: "static/tabbar/user.png",
        selectedIconPath: "static/tabbar/user-active.png"
      });
      common_vendor.index.setTabBar({
        list
      });
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
