"use strict";
const common_vendor = require("../../common/vendor.js");
const api_auth = require("../../api/auth.js");
const _sfc_main = {
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    async handleLogin() {
      if (!this.username || !this.password) {
        common_vendor.index.showToast({ title: "请填写完整", icon: "none" });
        return;
      }
      try {
        const res = await api_auth.login({ username: this.username, password: this.password });
        common_vendor.index.setStorageSync("token", res.token);
        common_vendor.index.setStorageSync("user", res.user);
        common_vendor.index.showToast({ title: "登录成功" });
        const app = getApp();
        app.checkLoginStatus();
        setTimeout(() => {
          common_vendor.index.switchTab({ url: "/pages/index/index" });
        }, 1500);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login.vue:47", error);
      }
    },
    async handleWxLogin() {
      common_vendor.index.showLoading({ title: "登录中...", mask: true });
      common_vendor.index.getUserInfo({
        provider: "weixin",
        success: (userRes) => {
          common_vendor.index.__f__("log", "at pages/login/login.vue:55", userRes);
          const userInfo = userRes.userInfo || {};
          const nickname = userInfo.nickName || "";
          const avatarUrl = userInfo.avatarUrl || "";
          common_vendor.index.login({
            provider: "weixin",
            success: async (loginRes) => {
              common_vendor.index.__f__("log", "at pages/login/login.vue:62", loginRes);
              try {
                const { data } = await api_auth.wechatLogin({
                  code: "0b36vpll24RWPg4aNTkl2z0WCk06vplt",
                  nickname,
                  avatar_url: avatarUrl
                });
                common_vendor.index.setStorageSync("token", data.token);
                common_vendor.index.setStorageSync("user", data.user);
                const app = getApp();
                if (app && app.checkLoginStatus) {
                  app.checkLoginStatus();
                }
                common_vendor.index.hideLoading();
                common_vendor.index.showToast({ title: "登录成功" });
                setTimeout(() => {
                  common_vendor.index.switchTab({ url: "/pages/index/index" });
                }, 1500);
              } catch (err) {
                common_vendor.index.hideLoading();
                common_vendor.index.__f__("error", "at pages/login/login.vue:82", err);
                common_vendor.index.showToast({ title: "微信登录失败", icon: "none" });
              }
            },
            fail: (err) => {
              common_vendor.index.hideLoading();
              common_vendor.index.__f__("error", "at pages/login/login.vue:88", err);
              common_vendor.index.showToast({ title: "微信登录失败", icon: "none" });
            }
          });
        },
        fail: (err) => {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/login/login.vue:95", err);
          common_vendor.index.showToast({ title: "微信授权失败", icon: "none" });
        }
      });
    },
    goToRegister() {
      common_vendor.index.navigateTo({ url: "/pages/register/register" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.username,
    b: common_vendor.o(($event) => $data.username = $event.detail.value),
    c: $data.password,
    d: common_vendor.o(($event) => $data.password = $event.detail.value),
    e: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    f: common_vendor.o((...args) => $options.handleWxLogin && $options.handleWxLogin(...args)),
    g: common_vendor.o((...args) => $options.goToRegister && $options.goToRegister(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
