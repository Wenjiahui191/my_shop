"use strict";
const common_vendor = require("../../common/vendor.js");
const api_address = require("../../api/address.js");
const PROVINCES = ["北京市", "天津市", "河北省", "山西省", "内蒙古自治区", "辽宁省", "吉林省", "黑龙江省", "上海市", "江苏省", "浙江省", "安徽省", "福建省", "江西省", "山东省", "河南省", "湖北省", "湖南省", "广东省", "广西壮族自治区", "海南省", "重庆市", "四川省", "贵州省", "云南省", "西藏自治区", "陕西省", "甘肃省", "青海省", "宁夏回族自治区", "新疆维吾尔自治区"];
const CITIES = {
  "北京市": ["东城区", "西城区", "朝阳区", "丰台区", "石景山区", "海淀区", "门头沟区", "房山区", "通州区", "顺义区", "昌平区", "大兴区", "怀柔区", "平谷区", "密云县", "延庆县"],
  "上海市": ["黄浦区", "徐汇区", "长宁区", "静安区", "普陀区", "虹口区", "杨浦区", "闵行区", "宝山区", "浦东新区", "金山区", "松江区", "青浦区", "奉贤区", "崇明县"],
  "广东省": ["广州市", "深圳市", "珠海市", "汕头市", "佛山市", "韶关市", "河源市", "梅州市", "惠州市", "汕尾市", "东莞市", "中山市", "阳江市", "清远市", "潮州市", "揭阳市", "云浮市"],
  "其他": ["其他"]
};
const _sfc_main = {
  data() {
    return {
      form: {
        id: null,
        name: "",
        phone: "",
        province: "",
        province_index: 0,
        city: "",
        city_index: 0,
        district: "",
        district_index: 0,
        detail: "",
        is_default: false
      },
      provinces: PROVINCES,
      cities: ["请选择"],
      districts: ["请选择"],
      loading: false,
      isEdit: false
    };
  },
  onLoad(options) {
    if (options.id) {
      this.form.id = options.id;
      this.isEdit = true;
      this.loadAddressDetail(options.id);
    }
  },
  methods: {
    async loadAddressDetail(id) {
      try {
        const addresses = await api_address.getAddresses();
        const address = addresses.find((a) => a.id === parseInt(id));
        if (address) {
          this.form = {
            id: address.id,
            name: address.name,
            phone: address.phone,
            province: address.province,
            province_index: this.provinces.indexOf(address.province),
            city: address.city,
            city_index: 0,
            district: address.district,
            district_index: 0,
            detail: address.detail,
            is_default: address.is_default
          };
          this.handleProvinceChange({ detail: { value: this.form.province_index } });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "加载地址失败",
          icon: "none"
        });
      }
    },
    handleProvinceChange(e) {
      var _a;
      const index = ((_a = e.detail) == null ? void 0 : _a.value) || e;
      this.form.province = this.provinces[index];
      this.form.province_index = index;
      const provinceCities = CITIES[this.form.province] || ["其他"];
      this.cities = provinceCities;
      this.form.city = provinceCities[0];
      this.form.city_index = 0;
      this.form.district = "";
      this.form.district_index = 0;
      this.districts = ["请选择"];
    },
    handleCityChange(e) {
      var _a;
      const index = ((_a = e.detail) == null ? void 0 : _a.value) || e;
      this.form.city = this.cities[index];
      this.form.city_index = index;
      this.form.district = "";
      this.form.district_index = 0;
      this.districts = ["请选择"];
    },
    handleDistrictChange(e) {
      var _a;
      const index = ((_a = e.detail) == null ? void 0 : _a.value) || e;
      this.form.district = this.districts[index];
      this.form.district_index = index;
    },
    async handleSubmit() {
      if (!this.form.name) {
        common_vendor.index.showToast({ title: "请输入收货人姓名", icon: "none" });
        return;
      }
      if (!this.form.phone) {
        common_vendor.index.showToast({ title: "请输入手机号码", icon: "none" });
        return;
      }
      if (!this.form.province) {
        common_vendor.index.showToast({ title: "请选择省份", icon: "none" });
        return;
      }
      if (!this.form.city) {
        common_vendor.index.showToast({ title: "请选择城市", icon: "none" });
        return;
      }
      if (!this.form.detail) {
        common_vendor.index.showToast({ title: "请输入详细地址", icon: "none" });
        return;
      }
      this.loading = true;
      try {
        const data = {
          name: this.form.name,
          phone: this.form.phone,
          province: this.form.province,
          city: this.form.city,
          district: this.form.district || "其他",
          detail: this.form.detail,
          is_default: this.form.is_default
        };
        if (this.isEdit) {
          await api_address.updateAddress(this.form.id, data);
          common_vendor.index.showToast({ title: "更新成功", icon: "success" });
        } else {
          await api_address.addAddress(data);
          common_vendor.index.showToast({ title: "添加成功", icon: "success" });
        }
        setTimeout(() => {
          common_vendor.index.navigateBack({ delta: 1 });
        }, 500);
      } catch (error) {
        common_vendor.index.showToast({
          title: this.isEdit ? "更新失败" : "添加失败",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    handleCancel() {
      common_vendor.index.navigateBack({ delta: 1 });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.form.name,
    b: common_vendor.o(($event) => $data.form.name = $event.detail.value),
    c: $data.form.phone,
    d: common_vendor.o(($event) => $data.form.phone = $event.detail.value),
    e: common_vendor.t($data.form.province || "请选择省份"),
    f: common_vendor.o((...args) => $options.handleProvinceChange && $options.handleProvinceChange(...args)),
    g: $data.form.province_index,
    h: $data.provinces,
    i: common_vendor.t($data.form.city || "请选择城市"),
    j: common_vendor.o((...args) => $options.handleCityChange && $options.handleCityChange(...args)),
    k: $data.form.city_index,
    l: $data.cities,
    m: common_vendor.t($data.form.district || "请选择区/县"),
    n: common_vendor.o((...args) => $options.handleDistrictChange && $options.handleDistrictChange(...args)),
    o: $data.form.district_index,
    p: $data.districts,
    q: $data.form.detail,
    r: common_vendor.o(($event) => $data.form.detail = $event.detail.value),
    s: $data.form.is_default,
    t: common_vendor.o(($event) => $data.form.is_default = $event.detail.value),
    v: common_vendor.o((...args) => $options.handleCancel && $options.handleCancel(...args)),
    w: common_vendor.t($data.loading ? "提交中..." : "确定"),
    x: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args)),
    y: $data.loading
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-dcb1f0d8"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/address/edit.js.map
