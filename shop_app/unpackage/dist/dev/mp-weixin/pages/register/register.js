"use strict";
const common_vendor = require("../../common/vendor.js");
const api_auth = require("../../api/auth.js");
const _sfc_main = {
  data() {
    return {
      username: "",
      password: "",
      phone: "",
      nickname: ""
    };
  },
  methods: {
    async handleRegister() {
      if (!this.username || !this.password || !this.phone) {
        common_vendor.index.showToast({ title: "请填写完整", icon: "none" });
        return;
      }
      try {
        await api_auth.register({
          username: this.username,
          password: this.password,
          phone: this.phone,
          nickname: this.nickname
        });
        common_vendor.index.showToast({ title: "注册成功" });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/register/register.vue:50", error);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.username,
    b: common_vendor.o(($event) => $data.username = $event.detail.value),
    c: $data.password,
    d: common_vendor.o(($event) => $data.password = $event.detail.value),
    e: $data.phone,
    f: common_vendor.o(($event) => $data.phone = $event.detail.value),
    g: $data.nickname,
    h: common_vendor.o(($event) => $data.nickname = $event.detail.value),
    i: common_vendor.o((...args) => $options.handleRegister && $options.handleRegister(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/register/register.js.map
