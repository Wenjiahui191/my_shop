"use strict";
const common_vendor = require("../../common/vendor.js");
const api_address = require("../../api/address.js");
const _sfc_main = {
  data() {
    return {
      addresses: []
    };
  },
  onShow() {
    this.loadAddresses();
  },
  methods: {
    async loadAddresses() {
      try {
        const res = await api_address.getAddresses();
        this.addresses = res.data;
      } catch (error) {
        common_vendor.index.showToast({
          title: "加载地址失败",
          icon: "none"
        });
      }
    },
    goToAdd() {
      common_vendor.index.navigateTo({ url: "/pages/address/edit" });
    },
    goToEdit(id) {
      common_vendor.index.navigateTo({ url: `/pages/address/edit?id=${id}` });
    },
    async handleDelete(id) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除此地址吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await api_address.deleteAddress(id);
              common_vendor.index.showToast({
                title: "删除成功",
                icon: "success"
              });
              this.loadAddresses();
            } catch (error) {
              common_vendor.index.showToast({
                title: "删除失败",
                icon: "none"
              });
            }
          }
        }
      });
    },
    async setDefault(id) {
      try {
        const address = this.addresses.find((a) => a.id === id);
        await api_address.updateAddress(id, {
          name: address.name,
          phone: address.phone,
          province: address.province,
          city: address.city,
          district: address.district,
          detail: address.detail,
          is_default: true
        });
        common_vendor.index.showToast({
          title: "已设为默认地址",
          icon: "success"
        });
        this.loadAddresses();
      } catch (error) {
        common_vendor.index.showToast({
          title: "设置失败",
          icon: "none"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.addresses.length === 0
  }, $data.addresses.length === 0 ? {} : {}, {
    b: common_vendor.f($data.addresses, (item, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.name),
        b: item.is_default
      }, item.is_default ? {} : {}, {
        c: common_vendor.t(item.province),
        d: common_vendor.t(item.city),
        e: common_vendor.t(item.district),
        f: common_vendor.t(item.detail),
        g: common_vendor.t(item.phone),
        h: common_vendor.o(($event) => $options.goToEdit(item.id), item.id),
        i: common_vendor.o(($event) => $options.handleDelete(item.id), item.id),
        j: !item.is_default
      }, !item.is_default ? {
        k: common_vendor.o(($event) => $options.setDefault(item.id), item.id)
      } : {}, {
        l: item.id
      });
    }),
    c: common_vendor.o((...args) => $options.goToAdd && $options.goToAdd(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-90a3874e"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/address/list.js.map
