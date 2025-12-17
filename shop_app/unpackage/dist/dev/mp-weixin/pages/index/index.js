"use strict";
const common_vendor = require("../../common/vendor.js");
const api_product = require("../../api/product.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  data() {
    return {
      products: [],
      page: 1,
      limit: 10,
      keyword: "",
      loading: false,
      hasMore: true,
      filePath: utils_request.filePath
    };
  },
  onShow() {
    this.loadProducts();
  },
  onReachBottom() {
    if (this.hasMore && !this.loading) {
      this.page++;
      this.loadProducts();
    }
  },
  methods: {
    async loadProducts() {
      this.loading = true;
      try {
        const res = await api_product.getProducts({
          page: this.page,
          limit: this.limit,
          search: this.keyword
        });
        if (this.page === 1) {
          this.products = res.data;
        } else {
          this.products = [...this.products, ...res.data];
        }
        this.hasMore = this.products.length < res.pagination.total;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:61", error);
      } finally {
        this.loading = false;
      }
    },
    onSearch() {
      this.page = 1;
      this.hasMore = true;
      this.loadProducts();
    },
    goToDetail(id) {
      common_vendor.index.navigateTo({ url: `/pages/product/detail?id=${id}` });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.onSearch && $options.onSearch(...args)),
    b: $data.keyword,
    c: common_vendor.o(($event) => $data.keyword = $event.detail.value),
    d: common_vendor.f($data.products, (item, k0, i0) => {
      return {
        a: $data.filePath + (item.image_url || "/uploads/logo.png"),
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.price),
        d: item.id,
        e: common_vendor.o(($event) => $options.goToDetail(item.id), item.id)
      };
    }),
    e: $data.loading
  }, $data.loading ? {} : {}, {
    f: !$data.hasMore
  }, !$data.hasMore ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
