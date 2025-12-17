"use strict";
const common_vendor = require("../../common/vendor.js");
const api_product = require("../../api/product.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  data() {
    return {
      categories: [],
      currentId: null,
      products: [],
      filePath: utils_request.filePath
    };
  },
  onLoad() {
    this.loadCategories();
  },
  methods: {
    async loadCategories() {
      try {
        const res = await api_product.getCategories();
        this.categories = res.data;
        if (this.categories.length > 0) {
          this.selectCategory(this.categories[0].id);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/category/category.vue:52", error);
      }
    },
    async selectCategory(id) {
      this.currentId = id;
      try {
        const res = await api_product.getProducts({ category_id: id, page: 1, limit: 100 });
        this.products = res.data;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/category/category.vue:61", error);
      }
    },
    goToDetail(id) {
      common_vendor.index.navigateTo({ url: `/pages/product/detail?id=${id}` });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.categories, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: $data.currentId === item.id ? 1 : "",
        c: item.id,
        d: common_vendor.o(($event) => $options.selectCategory(item.id), item.id)
      };
    }),
    b: common_vendor.f($data.products, (item, k0, i0) => {
      return {
        a: $data.filePath + (item.image_url || "/uploads/logo.png"),
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.price),
        d: item.id,
        e: common_vendor.o(($event) => $options.goToDetail(item.id), item.id)
      };
    }),
    c: $data.products.length === 0
  }, $data.products.length === 0 ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/category/category.js.map
