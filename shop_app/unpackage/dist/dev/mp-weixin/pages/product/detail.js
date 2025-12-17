"use strict";
const common_vendor = require("../../common/vendor.js");
const api_product = require("../../api/product.js");
const api_cart = require("../../api/cart.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  data() {
    return {
      product: null,
      filePath: utils_request.filePath
    };
  },
  onLoad(options) {
    if (options.id) {
      this.loadProduct(options.id);
    }
  },
  methods: {
    async loadProduct(id) {
      try {
        const res = await api_product.getProductById(id);
        this.product = res.data;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/product/detail.vue:40", error);
      }
    },
    async addToCart() {
      try {
        await api_cart.addToCart({ product_id: this.product.id, quantity: 1 });
        common_vendor.index.showToast({ title: "已加入购物车" });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/product/detail.vue:48", error);
      }
    },
    buyNow() {
      this.addToCart().then(() => {
        common_vendor.index.switchTab({ url: "/pages/cart/cart" });
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.product
  }, $data.product ? {
    b: $data.filePath + ($data.product.image_url || "/uploads/logo.png"),
    c: common_vendor.t($data.product.price),
    d: common_vendor.t($data.product.name),
    e: common_vendor.t($data.product.description),
    f: common_vendor.t($data.product.stock),
    g: common_vendor.o((...args) => $options.addToCart && $options.addToCart(...args)),
    h: common_vendor.o((...args) => $options.buyNow && $options.buyNow(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/product/detail.js.map
