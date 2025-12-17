"use strict";
const common_vendor = require("../../common/vendor.js");
const api_cart = require("../../api/cart.js");
const api_order = require("../../api/order.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  data() {
    return {
      cartList: [],
      filePath: utils_request.filePath,
      isLogin: false
    };
  },
  onShow() {
    this.checkLoginStatus();
    if (this.isLogin) {
      this.loadCart();
    }
  },
  computed: {
    totalPrice() {
      return this.cartList.reduce((total, item) => {
        return total + item.Product.price * item.quantity;
      }, 0).toFixed(2);
    }
  },
  methods: {
    checkLoginStatus() {
      const token = common_vendor.index.getStorageSync("token");
      this.isLogin = !!token;
    },
    goToLogin() {
      common_vendor.index.navigateTo({ url: "/pages/login/login" });
    },
    async loadCart() {
      try {
        const res = await api_cart.getCart();
        this.cartList = res.data;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/cart/cart.vue:78", error);
      }
    },
    async updateQuantity(item, change) {
      const newQuantity = item.quantity + change;
      if (newQuantity < 1)
        return;
      try {
        await api_cart.updateCartItem(item.id, { quantity: newQuantity });
        item.quantity = newQuantity;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/cart/cart.vue:88", error);
      }
    },
    async removeItem(id) {
      try {
        await api_cart.removeCartItem(id);
        this.loadCart();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/cart/cart.vue:96", error);
      }
    },
    async checkout() {
      if (this.cartList.length === 0) {
        common_vendor.index.showToast({ title: "购物车为空", icon: "none" });
        return;
      }
      try {
        await api_order.createOrder({ address_id: 1, remark: "来自小程序" });
        common_vendor.index.showToast({ title: "下单成功" });
        this.loadCart();
        setTimeout(() => {
          common_vendor.index.navigateTo({ url: "/pages/order/list" });
        }, 1500);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/cart/cart.vue:117", error);
        common_vendor.index.showToast({ title: "下单失败: " + (error.message || "未知错误"), icon: "none" });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.isLogin
  }, !$data.isLogin ? {
    b: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args))
  } : common_vendor.e({
    c: $data.cartList.length === 0
  }, $data.cartList.length === 0 ? {} : {
    d: common_vendor.f($data.cartList, (item, k0, i0) => {
      return {
        a: $data.filePath + (item.Product.image_url || "/uploads/logo.png"),
        b: common_vendor.t(item.Product.name),
        c: common_vendor.t(item.Product.price),
        d: common_vendor.o(($event) => $options.updateQuantity(item, -1), item.id),
        e: common_vendor.t(item.quantity),
        f: common_vendor.o(($event) => $options.updateQuantity(item, 1), item.id),
        g: common_vendor.o(($event) => $options.removeItem(item.id), item.id),
        h: item.id
      };
    })
  }, {
    e: $data.cartList.length > 0
  }, $data.cartList.length > 0 ? {
    f: common_vendor.t($options.totalPrice),
    g: common_vendor.o((...args) => $options.checkout && $options.checkout(...args))
  } : {}));
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/cart/cart.js.map
