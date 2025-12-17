"use strict";
const common_vendor = require("../../common/vendor.js");
const api_order = require("../../api/order.js");
const _sfc_main = {
  data() {
    return {
      orders: [],
      orderStatusMap: {
        pending: "待付款",
        paid: "已付款",
        shipped: "已发货",
        completed: "已完成",
        cancelled: "已取消"
      }
    };
  },
  onShow() {
    this.loadOrders();
  },
  methods: {
    async loadOrders() {
      try {
        const res = await api_order.getOrders();
        this.orders = res.data;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/order/list.vue:51", error);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.orders, (order, k0, i0) => {
      return {
        a: common_vendor.t(order.order_no),
        b: common_vendor.t($data.orderStatusMap[order.status]),
        c: common_vendor.f(order.OrderItems, (item, k1, i1) => {
          return {
            a: item.Product.image || "/static/logo.png",
            b: common_vendor.t(item.Product.name),
            c: common_vendor.t(item.price),
            d: common_vendor.t(item.quantity),
            e: item.id
          };
        }),
        d: common_vendor.t(order.total_amount),
        e: order.id
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/list.js.map
